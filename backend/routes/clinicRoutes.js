const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');
const { uploadToS3 } = require('../utils/S3');
const pool = require('../db');
const { getAvailableSlots } = require('../utils/availability');
const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 1. CREATE a clinic (Doctor only, one clinic per doctor)
router.post('/', verifyToken, requireRole('Doctor'), upload.single('logo'), async (req, res) => {
  const { name, address, phone, working_hours, consultation_fee } = req.body;
  try {
    const already = await pool.query('SELECT id FROM clinics WHERE owner_id = $1', [req.user.id]);
    if (already.rows.length > 0) {
      return res.status(400).json({ error: 'You already have a clinic. Use update instead.' });
    }

    let logoUrl = null;
    if (req.file) {
      const key = `clinic-logos/${req.user.id}-${Date.now()}-${req.file.originalname}`;
      logoUrl = await uploadToS3(req.file.buffer, key, req.file.mimetype);
    }

    const clinicResult = await pool.query(
      `INSERT INTO clinics (owner_id, name, address, phone, logo_url, working_hours, consultation_fee)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, name, address, phone, logoUrl, working_hours, consultation_fee]
    );
    const clinic = clinicResult.rows[0];

    // two-way link: doctor record points to the new clinic
    await pool.query('UPDATE doctors SET clinic_id = $1 WHERE user_id = $2', [clinic.id, req.user.id]);

    res.status(201).json({ message: 'Clinic created', clinic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create clinic' });
  }
});

// 2. GET the logged-in doctor's own clinic (must stay ABOVE the /:id route)
router.get('/me/clinic', verifyToken, requireRole('Doctor'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clinics WHERE owner_id = $1', [req.user.id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clinic' });
  }
});

// 3. UPDATE a clinic (ownership check)
router.put('/:id', verifyToken, requireRole('Doctor'), upload.single('logo'), async (req, res) => {
  const { name, address, phone, working_hours, consultation_fee } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM clinics WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Clinic not found' });
    if (existing.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this clinic' });
    }

    let logoUrl = existing.rows[0].logo_url;
    if (req.file) {
      const key = `clinic-logos/${req.user.id}-${Date.now()}-${req.file.originalname}`;
      logoUrl = await uploadToS3(req.file.buffer, key, req.file.mimetype);
    }

    const result = await pool.query(
      `UPDATE clinics
       SET name=$1, address=$2, phone=$3, logo_url=$4, working_hours=$5, consultation_fee=$6
       WHERE id = $7 RETURNING *`,
      [name, address, phone, logoUrl, working_hours, consultation_fee, req.params.id]
    );
    res.json({ message: 'Clinic updated', clinic: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update clinic' });
  }
});

// 4. PUBLIC get by id (needed later for the search page)
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clinics WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Clinic not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clinic' });
  }
});

module.exports = router;

// 5. AVAILABILITY: free slots for a clinic on a given date (public)
router.get('/:id/availability', async (req, res) => {
  const { date } = req.query; // expects YYYY-MM-DD
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date query param is required as YYYY-MM-DD' });
  }

  try {
    const clinicResult = await pool.query('SELECT * FROM clinics WHERE id = $1', [req.params.id]);
    if (clinicResult.rows.length === 0) {
      return res.status(404).json({ error: 'Clinic not found' });
    }
    const clinic = clinicResult.rows[0];

    // getUTCDay keeps the weekday correct no matter the server time zone
    const dayName = DAY_NAMES[new Date(date).getUTCDay()];

    const hours = clinic.working_hours || {};
    const daySchedule = hours[dayName];

    if (!daySchedule || daySchedule.closed) {
      return res.json({ date, day: dayName, slots: [] });
    }

    // Find the doctor linked to this clinic, then their bookings that day
    const doctorResult = await pool.query('SELECT id FROM doctors WHERE clinic_id = $1', [clinic.id]);
    const doctorId = doctorResult.rows[0]?.id;

    let bookedTimes = [];
    if (doctorId) {
      const bookedResult = await pool.query(
        `SELECT TO_CHAR(slot_time, 'HH24:MI') AS time FROM appointments
         WHERE doctor_id = $1 AND slot_time::date = $2 AND status != 'cancelled'`,
        [doctorId, date]
      );
      bookedTimes = bookedResult.rows.map((r) => r.time);
    }

    const slots = getAvailableSlots({
      openTime: daySchedule.open,
      closeTime: daySchedule.close,
      slotDurationMinutes: clinic.slot_duration_minutes || 30,
      bookedTimes,
    });

    res.json({ date, day: dayName, slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute availability' });
  }
});