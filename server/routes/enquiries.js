import express from 'express';
import { body, validationResult } from 'express-validator';
import Enquiry from '../models/Enquiry.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create enquiry
router.post(
  '/',
  [
    body('name', 'Name is required').trim().isLength({ min: 2 }),
    body('email', 'Valid email is required').isEmail(),
    body('phone', 'Valid 10-digit phone number is required').matches(/^[0-9]{10}$/)
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const {
        name,
        email,
        phone,
        enquiryType,
        country,
        state,
        city,
        visitorType,
        consent
      } = req.body;

      const enquiry = new Enquiry({
        name,
        email,
        phone,
        enquiryType,
        country,
        state,
        city,
        visitorType,
        consent
      });

      // If user is authenticated, link enquiry to user
      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const jwt = await import('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          enquiry.userId = decoded.id;
        } catch (error) {
          // Continue without user association
        }
      }

      await enquiry.save();

      res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully',
        enquiry
      });
    } catch (error) {
      console.error('Enquiry error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  }
);

// Get all enquiries (protected - admin only)
router.get('/', protect, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Get user's enquiries
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

export default router;
