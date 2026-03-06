# Shree Guhan Steels - Company Website

Professional consultancy website for **Shree Guhan Steels**, a premium manufacturer of steel windows and doors.

## 🎯 Project Overview

This is a modern, responsive web application built with React and Vite, designed to showcase premium steel door and window products, enable customer enquiries, and enhance the company's digital presence.

## ✨ Features

### Current Implementation

- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Modern UI/UX** - Clean, industrial design with brand-aligned colors
- ✅ **Product Showcase** - Organized product listings for doors and windows
- ✅ **Enquiry System** - Contact form with client-side validation
- ✅ **Routing** - Smooth navigation with React Router
- ✅ **Reusable Components** - Modular, maintainable code structure
- ✅ **REST API Ready** - Service layer prepared for backend integration

### Future Enhancements

- 🔮 **Backend Integration** - Node.js + Express REST API
- 🔮 **Database** - MongoDB Atlas for data persistence
- 🔮 **Server-Side Validation** - Enhanced security and data integrity
- 🔮 **Web AR** - Augmented Reality product visualization (WebXR, Three.js, AR.js)

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.5
- **Routing:** React Router DOM
- **Styling:** CSS3 with CSS Variables
- **JavaScript:** ES6+

### Backend (Planned)
- Node.js
- Express.js
- MongoDB Atlas
- RESTful APIs

## 📁 Project Structure

```
shree-guhan-steels/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, models, icons
│   │   ├── images/
│   │   │   ├── doors/
│   │   │   └── windows/
│   │   └── models/
│   ├── components/        # Reusable components
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   ├── ProductCard.jsx
│   │   └── ProductCard.css
│   ├── pages/             # Page components
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── Products/
│   │   │   ├── Products.jsx
│   │   │   ├── Doors.jsx
│   │   │   ├── Windows.jsx
│   │   │   └── Products.css
│   │   └── Contacts/
│   │       ├── Contact.jsx
│   │       └── Contact.css
│   ├── services/          # API service layer
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── App.css
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles & CSS variables
├── .env.example           # Environment variables template
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd shree-guhan-steels
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update `.env` with your configuration
```
VITE_API_URL=http://localhost:5000/api
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## 🎨 Design System

### Brand Colors

- **Steel Blue:** `#0F4C75` - Primary brand color
- **Industrial Gold:** `#D4A017` - Accent color
- **Charcoal Black:** `#1C1C1C` - Text and backgrounds

### CSS Variables

All design tokens are defined in [src/index.css](src/index.css):
- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Transitions

## 📱 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Hero section, features, CTA |
| `/products` | Products | All products listing |
| `/products/doors` | Doors | Steel doors catalog |
| `/products/windows` | Windows | Steel windows catalog |
| `/contact` | Contact | Enquiry form & contact info |

## 🔌 API Service

The API service ([src/services/api.js](src/services/api.js)) provides:

### Current (Mock Data)
- `getAllProducts()` - Get all products
- `getProductsByCategory(category)` - Get products by category
- `getProductById(id)` - Get single product
- `submitEnquiry(data)` - Submit enquiry form

### Backend Integration (Ready)
Simply update the `API_BASE_URL` in the service file when your backend is ready.

## 📋 Form Validation

### Client-Side Validation
- Name: Minimum 2 characters
- Email: Valid email format
- Phone: 10-digit number
- Message: Minimum 10 characters

## 🔒 Security Considerations

### Implemented
- Client-side input validation
- Form sanitization
- Error handling

### To Implement (Backend)
- Server-side validation
- Input sanitization
- HTTPS enforcement
- Environment variables for sensitive data
- Rate limiting
- CORS configuration

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🎯 Future Roadmap

### Phase 1: Backend (Next)
- [ ] Node.js + Express server
- [ ] MongoDB Atlas integration
- [ ] REST API endpoints
- [ ] Server-side validation
- [ ] Deployment to cloud

### Phase 2: Enhanced Features
- [ ] Product search and filtering
- [ ] Image gallery for products
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Analytics integration

### Phase 3: Advanced Features
- [ ] Web-based Augmented Reality
- [ ] 3D product visualization
- [ ] Virtual showroom
- [ ] Quote calculator
- [ ] Customer portal

## 🤝 Contributing

This is a professional consultancy project. For contributions or suggestions, please contact the development team.

## 📄 License

Copyright © 2026 Shree Guhan Steels. All rights reserved.

## 👥 Contact

**Shree Guhan Steels**
- Address: 123 Industrial Area, Manufacturing Zone, City, State - 123456
- Phone: +91 12345 67890
- Email: info@shreeguhansteels.com

---

**Built with ❤️ using React + Vite**
