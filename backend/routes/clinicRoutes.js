// backend/routes/clinicRoutes.js
// In simple terms, this file defines the routes related to clinics and appointments. It uses the verifyToken middleware to ensure that the user is authenticated and the requireRole middleware to enforce role-based access control. Depending on the user's role (Doctor, Admin, or Receptionist), they can access different endpoints for creating clinics, viewing users, or managing appointments.                                    
const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

// Only Doctors can create a clinic
router.post(
  '/clinics',
  verifyToken,
  requireRole('Doctor'),
  (req, res) => {
    res.json({
      message: `Clinic created by doctor ${req.user.email}`
    });
  }
);

// Only Admins can view the full user list
router.get(
  '/admin/users',
  verifyToken,
  requireRole('Admin'),
  (req, res) => {
    res.json({
      message: 'Full user list would go here'
    });
  }
);

// Doctors AND Receptionists can view appointments
router.get(
  '/appointments',
  verifyToken,
  requireRole('Doctor', 'Receptionist'),
  (req, res) => {
    res.json({
      message: 'Appointment list would go here'
    });
  }
);

module.exports = router;