import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: [true, 'Product ID is required']
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: 0
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
      default: 1
    },
    selectedSize: String,
    selectedColor: String,
    selectedDimension: String,
    image: String,
    type: {
      type: String,
      enum: ['door', 'window', 'other'],
      default: 'other'
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
      },
      phone: {
        type: String,
        required: [true, 'Phone is required'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
      }
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one order item is required'
      }
    },
    payment: {
      method: {
        type: String,
        enum: ['card', 'upi', 'netbanking', 'cod'],
        required: [true, 'Payment method is required']
      },
      provider: {
        type: String,
        enum: ['simulated'],
        default: 'simulated'
      },
      status: {
        type: String,
        enum: ['pending', 'authorized', 'paid', 'failed'],
        default: 'paid'
      },
      transactionRef: {
        type: String,
        required: [true, 'Transaction reference is required']
      },
      last4: String,
      upiHandleMasked: String,
      bankName: String,
      paidAt: {
        type: Date,
        default: Date.now
      }
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0
      },
      tax: {
        type: Number,
        required: true,
        min: 0
      },
      shipping: {
        type: Number,
        default: 0,
        min: 0
      },
      total: {
        type: Number,
        required: true,
        min: 0
      }
    },
    currency: {
      type: String,
      default: 'INR'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
