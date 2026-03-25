import crypto from 'crypto';
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const maskUpiHandle = (upiId) => {
  if (!upiId || typeof upiId !== 'string' || !upiId.includes('@')) {
    return '';
  }

  const [name, domain] = upiId.split('@');
  if (!name) {
    return `***@${domain}`;
  }

  const visible = name.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(1, name.length - 2))}@${domain}`;
};

const buildOrderId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SGS-${ts}-${suffix}`;
};

const buildTransactionRef = () => {
  const randomRef = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `TXN-${randomRef}`;
};

const statusNotes = {
  confirmed: 'Order confirmed',
  processing: 'Order is being processed',
  shipped: 'Order has been shipped',
  delivered: 'Order delivered successfully',
  cancelled: 'Order has been cancelled'
};

// Create order
router.post(
  '/',
  [
    body('customer.fullName', 'Full name is required').trim().isLength({ min: 2 }),
    body('customer.email', 'Valid email is required').isEmail(),
    body('customer.phone', 'Valid 10-digit phone number is required').matches(/^[0-9]{10}$/),
    body('customer.address', 'Address is required').trim().isLength({ min: 5 }),
    body('customer.city', 'City is required').trim().isLength({ min: 2 }),
    body('customer.state', 'State is required').trim().isLength({ min: 2 }),
    body('customer.pincode', 'Valid 6-digit pincode is required').matches(/^[0-9]{6}$/),
    body('items', 'At least one item is required').isArray({ min: 1 }),
    body('payment.method', 'Valid payment method is required').isIn(['card', 'upi', 'netbanking', 'cod', 'online']),
    body('pricing.subtotal', 'Subtotal must be a number').isFloat({ min: 0 }),
    body('pricing.tax', 'Tax must be a number').isFloat({ min: 0 }),
    body('pricing.shipping', 'Shipping must be a number').optional().isFloat({ min: 0 }),
    body('pricing.total', 'Total must be a number').isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { customer, items, payment, pricing, currency } = req.body;

      const normalizedItems = items.map((item) => ({
        productId: Number(item.productId || item.id),
        name: item.name,
        model: item.model || '',
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
        selectedSize: item.selectedSize || item.size || '',
        selectedColor: item.selectedColor || item.color || '',
        selectedDimension: item.selectedDimension || item.dimension || '',
        image: item.image || '',
        type: item.type === 'door' || item.type === 'window' ? item.type : 'other'
      }));

      const isCodOrder = payment.method === 'cod';
      const safePayment = {
        method: payment.method,
        provider: 'simulated',
        status: isCodOrder ? 'pending' : 'paid',
        transactionRef: buildTransactionRef()
      };

      if (!isCodOrder) {
        safePayment.paidAt = new Date();
      }

      if (payment.method === 'card' && payment.last4) {
        safePayment.last4 = String(payment.last4);
      }

      if (payment.method === 'upi' && payment.upiId) {
        safePayment.upiHandleMasked = maskUpiHandle(payment.upiId);
      }

      if (payment.method === 'netbanking' && payment.bankName) {
        safePayment.bankName = String(payment.bankName);
      }

      const order = new Order({
        orderId: buildOrderId(),
        customer,
        items: normalizedItems,
        payment: safePayment,
        pricing: {
          subtotal: Number(pricing.subtotal),
          tax: Number(pricing.tax),
          shipping: Number(pricing.shipping || 0),
          total: Number(pricing.total)
        },
        currency: currency || 'INR',
        trackingHistory: [
          {
            status: 'confirmed',
            note: statusNotes.confirmed,
            updatedAt: new Date()
          }
        ]
      });

      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          order.userId = decoded.id;
        } catch (error) {
          // Ignore auth parse failure for guest checkout.
        }
      }

      await order.save();

      return res.status(201).json({
        success: true,
        message: 'Order saved successfully',
        order: {
          orderId: order.orderId,
          status: order.status,
          paymentStatus: order.payment.status,
          total: order.pricing.total,
          currency: order.currency,
          createdAt: order.createdAt
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Unable to save order'
      });
    }
  }
);

// Get current user orders
router.get('/my', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email');
    const userEmail = String(user?.email || '').toLowerCase();

    const orders = await Order.find({
      $or: [
        { userId: req.userId },
        ...(userEmail ? [{ 'customer.email': userEmail }] : [])
      ]
    })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// Track order for guests using order ID and phone number
router.post(
  '/track',
  [
    body('orderId', 'Order ID is required').trim().isLength({ min: 6 }),
    body('phone', 'Valid 10-digit phone number is required').trim().matches(/^[0-9]{10}$/)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const orderId = String(req.body.orderId || '').trim().toUpperCase();
      const phone = String(req.body.phone || '').trim();

      const order = await Order.findOne({
        orderId,
        'customer.phone': phone
      }).select('orderId status trackingHistory createdAt updatedAt items pricing currency');

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found. Please verify your order ID and phone number.' });
      }

      return res.status(200).json({ success: true, order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
);

// Get tracking details for a single order of current user
router.get('/my/:orderId/tracking', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email');
    const userEmail = String(user?.email || '').toLowerCase();

    const order = await Order.findOne({
      orderId: req.params.orderId,
      $or: [
        { userId: req.userId },
        ...(userEmail ? [{ 'customer.email': userEmail }] : [])
      ]
    }).select('orderId status trackingHistory createdAt updatedAt');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// Get all orders (admin only)
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// Update order status (admin only)
router.patch(
  '/:id/status',
  protect,
  requireAdmin,
  [body('status', 'Valid status is required').isIn(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (order.status !== req.body.status) {
        order.status = req.body.status;
        order.trackingHistory = Array.isArray(order.trackingHistory) ? order.trackingHistory : [];
        order.trackingHistory.push({
          status: req.body.status,
          note: statusNotes[req.body.status] || `Order status updated to ${req.body.status}`,
          updatedAt: new Date()
        });
        await order.save();
      }

      return res.status(200).json({ success: true, order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
);

export default router;
