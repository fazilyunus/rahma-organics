# Rahma Organics - Full Stack E-Commerce Platform

A complete e-commerce solution for organic beauty products with customer storefront, admin dashboard, and M-Pesa payment integration.

## Features

### Customer Features
- 🛍️ Product browsing and shopping
- 🛒 Shopping cart functionality
- 💳 M-Pesa payment integration
- 📱 Responsive design (white & gold theme)

### Admin Features
- 👑 Secure admin dashboard
- 📦 Product management (CRUD)
- 📊 Order tracking
- 💰 Payment monitoring

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payments**: M-Pesa Daraja API

## Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm or yarn

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Database

Make sure PostgreSQL is running, then update `backend/.env`:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=rahma_organics
JWT_SECRET=your_secret_key
```

### 3. Initialize Database

```bash
cd backend
npm run init-db
```

This creates all tables and adds:
- Admin user: `admin@rahmaorganics.com` / `admin123`
- Sample products

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
rahma-organics/
├── backend/
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & admin middleware
│   ├── models/          # Database connection
│   ├── routes/          # API endpoints
│   ├── scripts/         # Database scripts
│   └── server.js        # Entry point
│
├── frontend/
│   ├── app/
│   │   ├── admin/       # Admin pages
│   │   ├── shop/        # Shop page
│   │   └── page.jsx     # Homepage
│   └── components/      # Reusable components
│
└── README.md
```

## API Endpoints

### Public
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/auth/login` - Admin login

### Protected (Admin)
- `GET /api/orders` - Get all orders
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### M-Pesa
- `POST /api/mpesa/stkpush` - Initiate payment
- `POST /api/mpesa/callback` - Payment callback

## M-Pesa Setup

1. Register at [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create an app and get credentials
3. Update `backend/.env`:

```env
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Render/Railway)
1. Push to GitHub
2. Connect to Render/Railway
3. Add environment variables
4. Deploy

### Database (Supabase/Neon)
1. Create PostgreSQL instance
2. Update connection string in `.env`
3. Run `npm run init-db`

## Admin Access

- URL: http://localhost:3000/admin/login
- Email: admin@rahmaorganics.com
- Password: admin123

## Development

### Add New Product (via Admin)
1. Login to admin dashboard
2. Go to "Manage Products"
3. Click "Add Product"
4. Fill in details and submit

### Test M-Pesa Payment
```bash
curl -X POST http://localhost:5000/api/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "254712345678",
    "amount": 1500,
    "orderId": 1
  }'
```

## License

MIT

## Support

For issues or questions, contact: support@rahmaorganics.com
