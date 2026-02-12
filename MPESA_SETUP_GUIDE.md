# M-Pesa Integration Setup Guide

## Current Status

✅ **Payment simulation is active** - Orders are created successfully without real M-Pesa integration.

The system currently simulates M-Pesa payments so you can test the full checkout flow. To enable real M-Pesa payments, follow the steps below.

## How to Get M-Pesa Credentials

### Step 1: Create Safaricom Developer Account

1. Go to [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)
2. Click "Sign Up" and create an account
3. Verify your email address
4. Log in to your account

### Step 2: Create an App

1. Once logged in, go to "My Apps"
2. Click "Add a New App"
3. Fill in the details:
   - **App Name**: Rahma Organics
   - **Description**: E-commerce payment integration
4. Select the APIs you need:
   - ✅ Lipa Na M-Pesa Online (STK Push)
5. Click "Create App"

### Step 3: Get Your Credentials

After creating the app, you'll see:

1. **Consumer Key** - Copy this
2. **Consumer Secret** - Copy this
3. **Passkey** - Found in the "Test Credentials" section

### Step 4: Get Shortcode

For **Sandbox (Testing)**:
- Shortcode: `174379` (provided by Safaricom)
- Test phone numbers: Any Safaricom number

For **Production**:
- You need to apply for a Paybill or Till number
- Contact Safaricom Business for this

### Step 5: Update Your .env File

Open `backend/.env` and update:

```env
# M-Pesa Daraja API
MPESA_CONSUMER_KEY=your_actual_consumer_key_here
MPESA_CONSUMER_SECRET=your_actual_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_actual_passkey_here
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

### Step 6: Set Up Callback URL

For M-Pesa to send payment confirmations, you need a public URL:

**Option 1: Use ngrok (for testing)**
```bash
# Install ngrok
npm install -g ngrok

# Start your backend
cd backend
npm start

# In another terminal, expose port 5000
ngrok http 5000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update .env:
MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/mpesa/callback
```

**Option 2: Deploy to production**
- Deploy backend to Render, Railway, or Heroku
- Use your production URL for callback

### Step 7: Restart Backend

```bash
cd backend
npm start
```

## Testing M-Pesa Integration

### Test in Sandbox Mode

1. Make sure you're using sandbox credentials
2. Use the test shortcode: `174379`
3. Use any Safaricom phone number for testing
4. You'll receive an STK push on your phone
5. Enter the test PIN: `1234` (or as provided by Safaricom)

### Test the Flow

1. Add products to cart
2. Go to checkout
3. Enter your M-Pesa phone number (format: 0712345678)
4. Click "Proceed to Checkout"
5. Check your phone for STK push
6. Enter PIN to complete payment

## Current Simulation Mode

While M-Pesa is not configured, the system:

✅ Creates orders successfully
✅ Saves order to database
✅ Links orders to logged-in users
✅ Shows success message
✅ Clears the cart
✅ Redirects to account/orders

The only difference is no actual money is charged.

## Production Checklist

Before going live with real payments:

- [ ] Get production credentials from Safaricom
- [ ] Apply for Paybill or Till number
- [ ] Deploy backend to production server
- [ ] Update callback URL to production domain
- [ ] Test with small amounts first
- [ ] Set up proper error handling
- [ ] Implement payment reconciliation
- [ ] Add payment status checking
- [ ] Set up webhook security (validate callbacks)
- [ ] Monitor transactions regularly

## Troubleshooting

### "Invalid Access Token"
- Check your Consumer Key and Secret
- Ensure they're from the same app
- Try regenerating credentials

### "Invalid Shortcode"
- Verify shortcode matches your credentials
- Sandbox: use `174379`
- Production: use your assigned shortcode

### "Callback URL not reachable"
- Ensure URL is publicly accessible
- Must be HTTPS (not HTTP)
- Test the URL in a browser
- Check firewall settings

### "Transaction Failed"
- Check phone number format (254XXXXXXXXX)
- Ensure sufficient balance
- Verify shortcode is active
- Check Daraja API status

## Support

- **Daraja Documentation**: https://developer.safaricom.co.ke/Documentation
- **Daraja Support**: apisupport@safaricom.co.ke
- **Community Forum**: https://developer.safaricom.co.ke/community

## Cost

- **Sandbox**: Free for testing
- **Production**: Transaction fees apply (check with Safaricom)
- Typical fees: 1-3% per transaction

## Security Notes

⚠️ **Never commit credentials to Git**
- Keep `.env` in `.gitignore`
- Use environment variables in production
- Rotate credentials regularly
- Validate all callbacks from M-Pesa

## Next Steps

1. Sign up at Daraja Portal
2. Create your app
3. Get credentials
4. Update `.env` file
5. Test in sandbox
6. Apply for production access
7. Go live!

---

**Note**: The current simulation mode allows you to develop and test the entire e-commerce flow without M-Pesa credentials. This is perfect for development and demo purposes.
