# Shree Guhan Steels - Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or MongoDB Atlas Cloud)
- npm or yarn

## Installation

### 1. Navigate to the Server Directory
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/shree-guhan-steels
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 3.1 Razorpay Setup
1. Create a Razorpay business account and complete KYC.
2. Use test keys during development and live keys only in production.
3. Configure a webhook URL: `https://<your-domain>/api/payments/webhook`.
4. Subscribe to events at minimum: `payment.captured`, `payment.failed`.

### 4. MongoDB Setup

#### Option A: Local MongoDB
- Download and install MongoDB Community Edition
- Start MongoDB service:
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### 5. Start the Server

#### Development Mode (with auto-reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Signup
- **POST** `/api/auth/signup`
- Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "company": "ABC Corp",
  "country": "India",
  "state": "Delhi",
  "city": "New Delhi",
  "userType": "Architect"
}
```

#### Login
- **POST** `/api/auth/login`
- Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`

### Enquiry Routes (`/api/enquiries`)

#### Create Enquiry
- **POST** `/api/enquiries`
- Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "enquiryType": "Quote Request",
  "country": "India",
  "state": "Delhi",
  "city": "New Delhi",
  "visitorType": "Architect",
  "consent": true
}
```

#### Get All Enquiries (Protected)
- **GET** `/api/enquiries`
- Headers: `Authorization: Bearer <token>`

#### Get User Enquiries
- **GET** `/api/enquiries/user/:userId`
- Headers: `Authorization: Bearer <token>`

### Payment Routes (`/api/payments`)

#### Create Razorpay Order
- **POST** `/api/payments/create-order`
- Body: checkout draft (customer + items)

#### Verify Razorpay Payment and Create Order
- **POST** `/api/payments/verify`
- Body:
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature",
  "customer": { "fullName": "John", "email": "john@example.com", "phone": "9876543210", "address": "Address", "city": "City", "state": "State", "pincode": "600001" },
  "items": []
}
```

#### Razorpay Webhook
- **POST** `/api/payments/webhook`
- Verifies `x-razorpay-signature` and updates payment status.

## Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  password: String (required, hashed),
  company: String,
  country: String,
  state: String,
  city: String,
  userType: String (Architect, Contractor, Designer, End User, Retailer, Other),
  createdAt: Date
}
```

### Enquiry Model
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  enquiryType: String,
  country: String,
  state: String,
  city: String,
  visitorType: String,
  consent: Boolean,
  userId: ObjectId (ref: User),
  status: String (New, In Progress, Resolved, Closed),
  createdAt: Date
}
```

## Frontend Configuration

In your frontend `.env.local` file, add:
```env
VITE_API_URL=http://localhost:5000/api
```

## Testing Endpoints

You can test the API using:
- Postman
- Insomnia
- cURL
- Thunder Client

Example cURL for signup:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB credentials

### Port Already in Use
```bash
# Change PORT in .env to a different number (e.g., 5001)
```

### CORS Issues
- Update CORS origin in `server/server.js` if frontend URL is different

## Security Notes
- Change `JWT_SECRET` in production
- Use strong passwords
- Enable MongoDB authentication
- Use HTTPS in production
- Implement rate limiting for production
