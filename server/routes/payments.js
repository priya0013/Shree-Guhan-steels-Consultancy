import crypto from 'crypto';
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';

const router = express.Router();

let razorpayClient;

const buildOrderId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SGS-${ts}-${suffix}`;
};

const getRazorpayClient = () => {
  if (razorpayClient) {
    return razorpayClient;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  }

  razorpayClient = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });

  return razorpayClient;
};

const getUserIdFromAuthHeader = (req) => {
  if (!req.headers.authorization) {
    return null;
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

const normalizeItems = (items = []) =>
  items.map((item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity || 1);

    return {
      productId: Number(item.productId || item.id),
      name: String(item.name || '').trim(),
      model: String(item.model || '').trim(),
      price,
      quantity,
      selectedSize: item.selectedSize || item.size || '',
      selectedColor: item.selectedColor || item.color || '',
      selectedDimension: item.selectedDimension || item.dimension || '',
      image: item.image || '',
      type: item.type === 'door' || item.type === 'window' ? item.type : 'other'
    };
  });

const validateAndBuildPricing = (normalizedItems) => {
  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const roundedSubtotal = Math.round(subtotal);
  const tax = Math.round(roundedSubtotal * 0.18);
  const shipping = 0;
  const total = roundedSubtotal + tax + shipping;

  return {
    subtotal: roundedSubtotal,
    tax,
    shipping,
    total
  };
};

const validateNormalizedItems = (normalizedItems) => {
  const hasInvalidItem = normalizedItems.some(
    (item) => !item.productId || !item.name || Number.isNaN(item.price) || item.price < 0 || Number.isNaN(item.quantity) || item.quantity < 1
  );

  if (hasInvalidItem || normalizedItems.length === 0) {
    throw new Error('Invalid cart items received');
  }
};

const createOrderDocument = async ({ req, customer, items, pricing, currency, payment }) => {
  const order = new Order({
    orderId: buildOrderId(),
    customer,
    items,
    payment,
    pricing,
    currency: currency || 'INR',
    status: 'confirmed'
  });

  const userId = getUserIdFromAuthHeader(req);
  if (userId) {
    order.userId = userId;
  }

  await order.save();
  return order;
};

router.post(
  '/create-order',
  [
    body('customer.fullName', 'Full name is required').trim().isLength({ min: 2 }),
    body('customer.email', 'Valid email is required').isEmail(),
    body('customer.phone', 'Valid 10-digit phone number is required').matches(/^[0-9]{10}$/),
    body('customer.address', 'Address is required').trim().isLength({ min: 5 }),
    body('customer.city', 'City is required').trim().isLength({ min: 2 }),
    body('customer.state', 'State is required').trim().isLength({ min: 2 }),
    body('customer.pincode', 'Valid 6-digit pincode is required').matches(/^[0-9]{6}$/),
    body('items', 'At least one item is required').isArray({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const razorpay = getRazorpayClient();
      const { customer, items } = req.body;

      const normalizedItems = normalizeItems(items);
      validateNormalizedItems(normalizedItems);

      const pricing = validateAndBuildPricing(normalizedItems);
      const amount = pricing.total * 100;

      const razorpayOrder = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          customerEmail: customer.email,
          customerPhone: customer.phone
        }
      });

      return res.status(201).json({
        success: true,
        keyId: process.env.RAZORPAY_KEY_ID,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to initialize payment order'
      });
    }
  }
);

router.post(
  '/verify',
  [
    body('razorpay_order_id', 'razorpay_order_id is required').isString().notEmpty(),
    body('razorpay_payment_id', 'razorpay_payment_id is required').isString().notEmpty(),
    body('razorpay_signature', 'razorpay_signature is required').isString().notEmpty(),
    body('customer.fullName', 'Full name is required').trim().isLength({ min: 2 }),
    body('customer.email', 'Valid email is required').isEmail(),
    body('customer.phone', 'Valid 10-digit phone number is required').matches(/^[0-9]{10}$/),
    body('customer.address', 'Address is required').trim().isLength({ min: 5 }),
    body('customer.city', 'City is required').trim().isLength({ min: 2 }),
    body('customer.state', 'State is required').trim().isLength({ min: 2 }),
    body('customer.pincode', 'Valid 6-digit pincode is required').matches(/^[0-9]{6}$/),
    body('items', 'At least one item is required').isArray({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const razorpay = getRazorpayClient();
      const {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        customer,
        items
      } = req.body;

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const receivedBuffer = Buffer.from(String(razorpaySignature), 'utf8');

      if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
        return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
      }

      const normalizedItems = normalizeItems(items);
      validateNormalizedItems(normalizedItems);

      const pricing = validateAndBuildPricing(normalizedItems);
      const paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);

      if (!paymentDetails || paymentDetails.order_id !== razorpayOrderId) {
        return res.status(400).json({ success: false, message: 'Payment order mismatch' });
      }

      if (paymentDetails.amount !== pricing.total * 100) {
        return res.status(400).json({ success: false, message: 'Payment amount mismatch' });
      }

      const paymentStatus = paymentDetails.status === 'captured' ? 'paid' : 'authorized';

      const order = await createOrderDocument({
        req,
        customer,
        items: normalizedItems,
        pricing,
        currency: 'INR',
        payment: {
          method: 'online',
          provider: 'razorpay',
          status: paymentStatus,
          transactionRef: razorpayPaymentId,
          gatewayOrderId: razorpayOrderId,
          gatewayPaymentId: razorpayPaymentId,
          gatewaySignature: razorpaySignature,
          paidAt: paymentStatus === 'paid' ? new Date() : undefined
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Payment verified and order placed successfully',
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
        message: error.message || 'Unable to verify payment'
      });
    }
  }
);

router.post('/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(200).json({ success: true, message: 'Webhook secret not configured' });
    }

    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body;

    if (!signature || !Buffer.isBuffer(rawBody)) {
      return res.status(400).json({ success: false, message: 'Invalid webhook payload' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(String(signature), 'utf8');

    if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const eventData = JSON.parse(rawBody.toString('utf8'));
    const eventName = eventData.event;
    const payment = eventData?.payload?.payment?.entity;

    if (!payment) {
      return res.status(200).json({ success: true, message: 'Webhook received without payment entity' });
    }

    if (eventName === 'payment.captured') {
      await Order.findOneAndUpdate(
        { 'payment.gatewayPaymentId': payment.id },
        {
          'payment.status': 'paid',
          'payment.paidAt': new Date()
        }
      );
    }

    if (eventName === 'payment.failed') {
      await Order.findOneAndUpdate(
        { 'payment.gatewayPaymentId': payment.id },
        {
          'payment.status': 'failed'
        }
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Webhook handling failed' });
  }
});

export default router;
