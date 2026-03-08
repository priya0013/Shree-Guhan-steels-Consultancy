# Email Setup Guide for Quote Request System

## Overview
The quote request system sends email notifications to your sales team when customers request quotes. This guide will help you configure email settings.

## Email Service Options

### Option 1: Gmail (Recommended for Small Businesses)
**Pros:**
- Free for up to 500 emails per day
- Easy to set up
- Reliable delivery

**Cons:**
- Daily sending limit (500 emails)
- Requires 2-factor authentication and app passwords

**Setup Steps:**

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Under "Signing in to Google", select "2-Step Verification"
   - Follow the setup process

2. **Create App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or Other)
   - Click "Generate"
   - Copy the 16-character password (example: `abcd efgh ijkl mnop`)

3. **Update .env File**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop  # Remove spaces from app password
   SALES_EMAIL=sales@shreeguhansteels.com  # Where quote requests will be sent
   ```

4. **Important Notes:**
   - Use the app password, NOT your regular Gmail password
   - Remove all spaces from the app password
   - Keep this password secret and never commit it to Git

### Option 2: SendGrid (Recommended for Production)
**Pros:**
- 100 emails per day on free tier (paid plans for more)
- Better deliverability
- Professional email service
- Detailed analytics

**Setup Steps:**

1. **Create SendGrid Account**
   - Go to https://signup.sendgrid.com/
   - Sign up for a free account

2. **Create API Key**
   - Go to Settings > API Keys
   - Click "Create API Key"
   - Choose "Full Access" or "Restricted Access" (Mail Send only)
   - Copy the API key (you'll only see it once!)

3. **Update server/routes/quotes.js**
   Replace the email configuration section:
   ```javascript
   const createTransporter = () => {
     return nodemailer.createTransport({
       host: 'smtp.sendgrid.net',
       port: 587,
       auth: {
         user: 'apikey', // This is literally the string 'apikey'
         pass: process.env.SENDGRID_API_KEY
       }
     });
   };
   ```

4. **Update .env File**
   ```env
   SENDGRID_API_KEY=SG.your_api_key_here
   EMAIL_USER=noreply@yourdomain.com  # Sender email (must be verified in SendGrid)
   SALES_EMAIL=sales@shreeguhansteels.com
   ```

5. **Verify Sender Email**
   - Go to Settings > Sender Authentication
   - Verify your sender email or domain

## Testing Your Email Configuration

### 1. Start the Server
```bash
cd server
npm run dev
```

### 2. Test Quote Request
- Go to any product detail page (door or window)
- Click "Request a Quote" button
- Fill in the form with test data
- Submit the form

### 3. Check for Success
- Look for console message: "New quote request received"
- Check the sales email inbox for the notification
- Verify quote was saved in database (check MongoDB)

### 4. Troubleshooting

**"Invalid login" error:**
- Gmail: Make sure you're using app password, not regular password
- SendGrid: Check API key is correct

**Email not received:**
- Check spam/junk folder
- Verify SALES_EMAIL is correct in .env
- Check server console for error messages
- Ensure sender email is verified (SendGrid)

**"Connection refused" error:**
- Check internet connection
- Verify SMTP settings (host, port)
- Gmail may block less secure apps - use app password

## Email Template Customization

The email template is defined in `server/routes/quotes.js` in the `sendQuoteEmail` function.

You can customize:
- Email subject line
- Color scheme (currently uses purple #667eea and orange #d97643)
- Company logo (add `<img>` tag in header)
- Footer text
- Additional fields

Example customization:
```javascript
const emailHtml = `
  <div style="...">
    <div style="...">
      <img src="https://yourdomain.com/logo.png" alt="Logo" style="height: 50px;"/>
      <h1>New Quote Request</h1>
    </div>
    <!-- Rest of template -->
  </div>
`;
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Sender email address | `noreply@gmail.com` |
| `EMAIL_PASSWORD` | Gmail app password or SendGrid API key | `abcdefghijklmnop` |
| `SALES_EMAIL` | Email to receive quote notifications | `sales@shreeguhansteels.com` |
| `SENDGRID_API_KEY` | (Optional) SendGrid API key | `SG.xxxxx` |

## Security Best Practices

1. **Never commit .env file to Git**
   - Already in .gitignore
   - Use .env.example for documentation

2. **Use environment-specific configs**
   - Development: Gmail (for testing)
   - Production: SendGrid or professional SMTP

3. **Rotate credentials regularly**
   - Change app passwords every 3-6 months
   - Regenerate API keys if compromised

4. **Limit access**
   - Only share .env with authorized team members
   - Use separate credentials for dev/staging/prod

## Quote Database Schema

Quotes are stored in MongoDB with this structure:

```javascript
{
  quoteId: "SGS-Q-123456-ABC",  // Unique identifier
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    message: "Optional message"
  },
  product: {
    id: 1,
    name: "Industrial Steel Door",
    model: "ISD-2024-PRO",
    price: "₹12,999",
    size: "36\" x 84\"",
    type: "door"
  },
  status: "pending",  // pending | contacted | quoted | closed | rejected
  emailSent: true,    // Was email notification sent?
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

## Future Enhancements

- [ ] Admin dashboard to view and manage quotes
- [ ] Auto-reply email to customers
- [ ] Quote status tracking (pending → contacted → quoted → closed)
- [ ] Email templates for different quote statuses
- [ ] Quote PDF generation
- [ ] Integration with CRM systems
- [ ] SMS notifications for urgent quotes

## Support

If you encounter issues:
1. Check server console for error messages
2. Verify all environment variables are set correctly
3. Test email credentials using a simple nodemailer test script
4. Check MongoDB connection and database logs

For Gmail app password issues: https://support.google.com/accounts/answer/185833
For SendGrid documentation: https://docs.sendgrid.com/

---

**Current Setup Status:**
- ✅ Quote request form on product detail pages
- ✅ Form validation (name, email, phone required)
- ✅ MongoDB schema for storing quotes
- ✅ Email notification system with HTML template
- ✅ Backend API route `/api/quotes`
- ✅ Frontend integration with API
- ⏳ Email credentials configuration (needs your setup)
- ⏳ Admin dashboard (future enhancement)
