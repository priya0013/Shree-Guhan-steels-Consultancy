import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  quoteId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      trim: true,
      default: ''
    }
  },
  product: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    model: {
      type: String
    },
    category: {
      type: String
    },
    price: {
      type: String,
      required: true
    },
    size: {
      type: String
    },
    type: {
      type: String,
      enum: ['door', 'window'],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'quoted', 'closed', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
quoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;
