const router = require('express').Router();
const axios = require('axios');

// M-Pesa credentials (from Daraja API)
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || 'your_consumer_key';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || 'your_consumer_secret';
const BUSINESS_SHORT_CODE = process.env.MPESA_SHORTCODE || '174379';
const PASSKEY = process.env.MPESA_PASSKEY || 'your_passkey';
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa/callback';

// Get OAuth token
async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

// STK Push (Lipa Na M-Pesa Online)
router.post('/stkpush', async (req, res) => {
  const { phone, amount, orderId } = req.body;

  if (!phone || !amount) {
    return res.status(400).json({ message: 'Phone and amount required' });
  }

  // Check if M-Pesa is configured
  if (CONSUMER_KEY === 'your_consumer_key' || !CONSUMER_KEY || CONSUMER_KEY.includes('your_')) {
    console.log('⚠️ M-Pesa not configured - simulating payment');
    return res.json({
      success: true,
      message: 'Payment simulation (M-Pesa not configured)',
      simulated: true,
      data: {
        MerchantRequestID: 'SIMULATED-' + Date.now(),
        CheckoutRequestID: 'SIMULATED-' + Date.now(),
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CustomerMessage: 'Success. Request accepted for processing'
      }
    });
  }

  try {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`).toString('base64');

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: BUSINESS_SHORT_CODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: `Order${orderId || 'TEST'}`,
        TransactionDesc: 'Rahma Organics Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({
      success: true,
      message: 'STK Push sent',
      data: response.data,
    });
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Payment initiation failed',
      error: error.response?.data || error.message,
    });
  }
});

// M-Pesa callback
router.post('/callback', async (req, res) => {
  console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
  
  // Process the callback and update order status
  const { Body } = req.body;
  
  if (Body?.stkCallback?.ResultCode === 0) {
    // Payment successful
    console.log('Payment successful');
    // Update order status in database here
  } else {
    // Payment failed
    console.log('Payment failed');
  }

  res.json({ message: 'Callback received' });
});

module.exports = router;
