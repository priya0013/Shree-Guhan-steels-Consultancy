import express from 'express';
import { body, validationResult } from 'express-validator';
import Quote from '../models/Quote.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

// Email configuration (using Gmail - you can change this)
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'your-email@gmail.com';
  // App password is often copied with spaces, so normalize it automatically.
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

// Generate unique quote ID
const generateQuoteId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SGS-Q-${timestamp}-${randomStr}`;
};

// Send email notification to sales team
const sendQuoteEmail = async (quoteData) => {
  const transporter = createTransporter();
  
  const salesEmail = process.env.SALES_EMAIL || 'sales@shreeguhansteels.com';
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">New Quote Request</h1>
        <p style="margin: 5px 0;">Shree Guhan Steels</p>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <h2 style="color: #333; border-bottom: 3px solid #d97643; padding-bottom: 10px;">Quote ID: ${quoteData.quoteId}</h2>
        
        <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 8px;">
          <h3 style="color: #667eea; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${quoteData.customer.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${quoteData.customer.email}">${quoteData.customer.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${quoteData.customer.phone}">${quoteData.customer.phone}</a></p>
          ${quoteData.customer.message ? `<p><strong>Message:</strong><br/>${quoteData.customer.message}</p>` : ''}
        </div>
        
        <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 8px;">
          <h3 style="color: #d97643; margin-top: 0;">Product Details</h3>
          <p><strong>Product:</strong> ${quoteData.product.name}</p>
          ${quoteData.product.model ? `<p><strong>Model:</strong> ${quoteData.product.model}</p>` : ''}
          ${quoteData.product.category ? `<p><strong>Category:</strong> ${quoteData.product.category}</p>` : ''}
          <p><strong>Price:</strong> ${quoteData.product.price}</p>
          ${quoteData.product.size ? `<p><strong>Size:</strong> ${quoteData.product.size}</p>` : ''}
          <p><strong>Type:</strong> ${quoteData.product.type.toUpperCase()}</p>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 5px 0;">Shree Guhan Steels - Premium Steel Doors & Windows</p>
        <p style="margin: 5px 0;">This is an automated notification. Please respond to the customer directly.</p>
      </div>
    </div>
  `;
  
  const mailOptions = {
    from: `"Shree Guhan Steels - Quote System" <${process.env.EMAIL_USER}>`,
    to: salesEmail,
    subject: `New Quote Request - ${quoteData.quoteId} - ${quoteData.product.name}`,
    html: emailHtml,
    replyTo: quoteData.customer.email
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// POST /api/quotes - Create new quote request
router.post('/',
  [
    body('customer.name').trim().notEmpty().withMessage('Name is required'),
    body('customer.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('customer.phone').trim().notEmpty().withMessage('Phone is required'),
    body('customer.message').optional().trim(),
    body('product.id').isInt().withMessage('Product ID is required'),
    body('product.name').trim().notEmpty().withMessage('Product name is required'),
    body('product.price').trim().notEmpty().withMessage('Product price is required'),
    body('product.type').isIn(['door', 'window']).withMessage('Product type must be door or window')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const quoteId = generateQuoteId();
      
      const quoteData = {
        quoteId,
        customer: {
          name: req.body.customer.name,
          email: req.body.customer.email,
          phone: req.body.customer.phone,
          message: req.body.customer.message || ''
        },
        product: {
          id: req.body.product.id,
          name: req.body.product.name,
          model: req.body.product.model || '',
          category: req.body.product.category || '',
          price: req.body.product.price,
          size: req.body.product.size || '',
          type: req.body.product.type
        },
        status: 'pending'
      };
      
      // Save to database
      const quote = new Quote(quoteData);
      await quote.save();

      // Respond immediately; send email in background to avoid blocking user request.
      res.status(201).json({
        success: true,
        message: 'Quote request submitted successfully',
        quoteId: quoteId,
        emailSent: false
      });

      // Background email send + status update.
      sendQuoteEmail(quoteData)
        .then(async (emailSent) => {
          if (emailSent) {
            quote.emailSent = true;
            await quote.save();
          }
        })
        .catch((error) => {
          console.error('Background quote email failed:', error);
        });
      
    } catch (error) {
      console.error('Quote submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit quote request',
        error: error.message
      });
    }
  }
);

// GET /api/quotes - Get all quotes (for admin)
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: quotes.length,
      quotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotes',
      error: error.message
    });
  }
});

// GET /api/quotes/:id - Get single quote
router.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findOne({ quoteId: req.params.id });
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }
    
    res.json({
      success: true,
      quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quote',
      error: error.message
    });
  }
});

// PATCH /api/quotes/:id - Update quote status
router.patch('/:id',
  [
    body('status').optional().isIn(['pending', 'contacted', 'quoted', 'closed', 'rejected']),
    body('notes').optional().trim()
  ],
  async (req, res) => {
    try {
      const quote = await Quote.findOne({ quoteId: req.params.id });
      
      if (!quote) {
        return res.status(404).json({
          success: false,
          message: 'Quote not found'
        });
      }
      
      if (req.body.status) {
        quote.status = req.body.status;
      }
      
      if (req.body.notes !== undefined) {
        quote.notes = req.body.notes;
      }
      
      await quote.save();
      
      res.json({
        success: true,
        message: 'Quote updated successfully',
        quote
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update quote',
        error: error.message
      });
    }
  }
);

export default router;
