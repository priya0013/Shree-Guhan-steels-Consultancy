import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    enquiryType: {
      type: String,
      enum: ['Product Information', 'Quote Request', 'Technical Support', 'Bulk Order', 'Franchise Inquiry', 'Other'],
      default: 'Product Information'
    },
    country: String,
    state: String,
    city: String,
    visitorType: {
      type: String,
      enum: ['Architect', 'Contractor', 'Designer', 'End User', 'Retailer', 'Other']
    },
    consent: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved', 'Closed'],
      default: 'New'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('Enquiry', enquirySchema);
