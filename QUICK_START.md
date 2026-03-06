# Quick Start Guide - Shree Guhan Steels

## Prerequisites
- Node.js v14+
- MongoDB (Local or Atlas)
- npm or yarn

## Project Structure
```
shree-guhan-steels/
├── src/                    # Frontend React code
├── server/                 # Backend Node.js code
├── BACKEND_SETUP.md       # Backend setup instructions
└── .env.local.example     # Frontend env template
```

## Step-by-Step Setup

### 1. Install Backend Dependencies
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and configuration
```

### 2. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud service (connection string in .env)
```

### 3. Start Backend Server
```bash
# From server directory
npm run dev  # Development with auto-reload
# Or
npm start    # Production
```
Server runs on: `http://localhost:5000`

### 4. In Another Terminal - Install Frontend Dependencies
```bash
# From project root
npm install
cp .env.local.example .env.local
```

### 5. Start Frontend Development Server
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173` (or shown in terminal)

## Features Implemented

### Authentication
- ✅ Signup with validation
- ✅ Login with JWT tokens
- ✅ Logout functionality
- ✅ Protected routes
- ✅ User context management

### User Management
- ✅ User registration with details (name, email, phone, company, location, user type)
- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Session persistence with localStorage

### Enquiry System
- ✅ Contact form submission
- ✅ Authenticated enquiry creation
- ✅ User enquiry history
- ✅ Admin enquiry management

### UI Components
- ✅ Login page with validation
- ✅ Signup page with multi-step form
- ✅ Header authentication buttons
- ✅ User profile dropdown
- ✅ Protected routes (if needed)

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Enquiries
- `POST /api/enquiries` - Submit enquiry
- `GET /api/enquiries` - Get all enquiries (protected)
- `GET /api/enquiries/user/:userId` - Get user enquiries (protected)

## Environment Variables

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```env
MONGODB_URI=mongodb://localhost:27017/shree-guhan-steels
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run linter
npm run preview  # Preview production build
```

### Backend
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start server
```

## Testing Authentication

### Signup
1. Visit `http://localhost:5173/signup`
2. Fill in user details
3. Create account - redirects to home page
4. User info stored in localStorage

### Login
1. Visit `http://localhost:5173/login`
2. Enter email and password
3. Token stored in localStorage
4. User profile visible in header

### Logout
1. Click user profile in header
2. Click "Logout"
3. Token removed from localStorage
4. Login/Signup buttons reappear

## File Structure

### Frontend Components
```
src/
├── context/
│   └── AuthContext.jsx        # Global auth state
├── pages/
│   └── Auth/
│       ├── Login.jsx          # Login page
│       ├── Signup.jsx         # Signup page
│       └── Auth.css           # Auth styles
├── services/
│   └── api.js                 # API calls
└── components/
    └── Header/
        ├── Header.jsx         # Updated with auth
        └── Header.css         # Auth button styles
```

### Backend Files
```
server/
├── models/
│   ├── User.js                # User schema
│   └── Enquiry.js             # Enquiry schema
├── middleware/
│   └── auth.js                # JWT verification
├── routes/
│   ├── auth.js                # Auth endpoints
│   └── enquiries.js           # Enquiry endpoints
├── server.js                  # Main server file
├── package.json
├── .env.example
└── .env (create from .env.example)
```

## Database Management

### View MongoDB Collections
```bash
# Using MongoDB Compass or mongosh
use shree-guhan-steels
db.users.find()
db.enquiries.find()
```

## Deployment Notes

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production backend URL
2. Deploy from root directory
3. Set environment variables in deployment settings

### Backend (Heroku/Railway/AWS)
1. Update `JWT_SECRET` with strong secret
2. Use MongoDB Atlas for database
3. Set `NODE_ENV=production`
4. Enable CORS for frontend domain

## Troubleshooting

### Backend Connection Error
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Ensure port 5000 is available

### Frontend Can't Connect to Backend
- Check `VITE_API_URL` is correct
- Ensure backend is running
- Check CORS configuration

### Login Issues
- Verify credentials are correct
- Check browser console for errors
- Inspect Network tab for API response

## Support
For more details, see:
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Detailed backend setup
- [README.md](./README.md) - General project info
