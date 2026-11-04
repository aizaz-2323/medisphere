const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');
const { uploadToS3 } = require('../utils/S3');
const pool = require('../db');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post(
  '/profile',
  verifyToken,
  requireRole('Doctor'),
  upload.single('credentialDoc'),
  async (req, res) => {
    const { specialisation, qualification, license_number } = req.body;
    try {
      let docUrl = null;
      if (req.file) {
        const key = `credentials/${req.user.id}-${Date.now()}-${req.file.originalname}`;
        docUrl = await uploadToS3(req.file.buffer, key, req.file.mimetype);
      }
      const result = await pool.query(
        `UPDATE doctors
         SET specialisation = $1, qualification = $2, license_number = $3,
             credential_doc_url = COALESCE($4, credential_doc_url),
             verification_status = 'pending'
         WHERE user_id = $5
         RETURNING *`,
        [specialisation, qualification, license_number, docUrl, req.user.id]
      );
      res.json({ message: 'Profile submitted for verification', doctor: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update doctor profile' });
    }
  }
);

router.get('/me', verifyToken, requireRole('Doctor'), async (req, res) => {
  const result = await pool.query('SELECT * FROM doctors WHERE user_id = $1', [req.user.id]);
  res.json(result.rows[0]);
});

module.exports = router;