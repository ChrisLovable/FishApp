# Quick Email Setup for 20 People 🚀

## **Perfect for Your Testing Group!**

EmailJS gives you **200 emails/month FREE** - perfect for 20 people with multiple verifications.

## **5-Minute Setup:**

### **Step 1: Sign up for EmailJS**
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" (free account)
3. Verify your email

### **Step 2: Create Email Service**
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose **Gmail** (easiest option)
4. Connect your Gmail account
5. **Copy the Service ID** (looks like: `service_abc123`)

### **Step 3: Create Email Template**
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Subject:** `FishApp - Email Verification Code`

**Content:**
```
Hello!

Welcome to FishApp - Your Complete Fishing Companion!

Your verification code is: {{verification_code}}

This code will expire in 15 minutes.

Enter this code in the FishApp verification screen to complete your registration.

Once verified, you'll have access to:
🐠 Fish identification with AI
📏 Length-to-weight calculator
🌊 Tide and moon information
🎣 Catch tracking and sharing
📍 Location-based fishing reports
📚 Species information database

Happy fishing!
The FishApp Team
```

4. **Copy the Template ID** (looks like: `template_xyz789`)

### **Step 4: Get Public Key**
1. Go to "Account" → "General"
2. **Copy your Public Key** (looks like: `user_abc123def456`)

### **Step 5: Add to Your App**
1. Create/update your `.env` file:
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=user_abc123def456
```

2. Update the service IDs in `src/utils/emailService.ts`:
```typescript
const response = await emailjs.send(
  'service_abc123', // Your actual service ID
  'template_xyz789', // Your actual template ID
  templateParams,
  this.apiKey!
)
```

### **Step 6: Test It!**
1. Run your app: `npm run dev`
2. Enter your email in verification form
3. Check your email inbox for the verification code
4. Complete verification and test PWA installation

## **That's It! 🎉**

Your email verification will now work for real emails. Perfect for your 20-person testing group!

## **Fallback for Development:**
If you don't set up EmailJS yet, the system still works:
- Verification codes appear in browser console
- You can copy/paste them for testing
- Full functionality works end-to-end

## **For Production:**
- EmailJS free tier: 200 emails/month
- Upgrade if you need more: $15/month for 1,000 emails
- Perfect scaling for your growth!

---

**Ready to test with real emails?** Just follow the 5 steps above! 📧✅
