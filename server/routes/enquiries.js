import express from 'express';
import { body, validationResult } from 'express-validator';
import Enquiry from '../models/Enquiry.js';
import nodemailer from 'nodemailer';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'your-email@gmail.com';
  const emailPassword = (process.env.EMAIL_PASSWORD || 'your-app-password').replace(/\s+/g, '');

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: {
      user: emailUser,
      pass: emailPassword
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
  });
};

const sendEnquiryEmail = async (enquiry) => {
  const transporter = createTransporter();
  const salesEmail = process.env.SALES_EMAIL || 'sales@shreeguhansteels.com';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #d97643; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">New Contact Enquiry</h2>
      </div>
      <div style="background: #f7f7f7; padding: 20px;">
        <div style="background: #fff; padding: 16px; border-radius: 8px;">
          <p><strong>Name:</strong> ${enquiry.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${enquiry.phone}">${enquiry.phone}</a></p>
          <p><strong>Enquiry Type:</strong> ${enquiry.enquiryType || 'N/A'}</p>
          <p><strong>Country:</strong> ${enquiry.country || 'N/A'}</p>
          <p><strong>State:</strong> ${enquiry.state || 'N/A'}</p>
          <p><strong>City:</strong> ${enquiry.city || 'N/A'}</p>
          <p><strong>Visitor Type:</strong> ${enquiry.visitorType || 'N/A'}</p>
          <p><strong>Consent:</strong> ${enquiry.consent ? 'Yes' : 'No'}</p>
          <p><strong>Submitted At:</strong> ${new Date(enquiry.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Shree Guhan Steels - Enquiry" <${process.env.EMAIL_USER}>`,
      to: salesEmail,
      subject: `New Enquiry - ${enquiry.enquiryType || 'Contact Form'} - ${enquiry.name}`,
      html,
      replyTo: enquiry.email
    });
    return true;
  } catch (error) {
    console.error('Enquiry email sending failed:', error.message);
    return false;
  }
};

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

      const emailSent = await sendEnquiryEmail(enquiry);
      enquiry.emailSent = emailSent;
      await enquiry.save();

      res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully',
        enquiry,
        emailSent
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
router.get('/', protect, requireAdmin, async (req, res) => {
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

// Update enquiry status (admin only)
router.patch('/:id/status', protect, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['New', 'In Progress', 'Resolved', 'Closed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    enquiry.status = status;
    await enquiry.save();

    res.status(200).json({
      success: true,
      message: 'Enquiry status updated successfully',
      enquiry
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
