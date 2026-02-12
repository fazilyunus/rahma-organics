# Quick Setup Guide

## Step-by-Step Instructions

### 1. Database Setup

Make sure PostgreSQL is running on your machine.

```bash
# Check if PostgreSQL is running
psql --version
```

### 2. Initialize Database

```bash
cd backend
npm run init-db
```

You should see:
```
✅ Users table created
✅ Products table created
✅ Orders table created
✅ Admin user created (email: admin@rahmaorganics.com, password: admin123)
✅ Sample products added
```

### 3. Start Backend Server

```bash
cd backend
npm start
```

Expected output:
```
✅ Backend running on http://localhost:5000
🟢 Database connected
```

### 4. Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

Expected output:
```
- ready started server on 0.0.0.0:3000
```

### 5. Access the Application

- **Customer Site**: http://localhost:3000
- **Shop Page**: http://localhost:3000/shop
- **Admin Login**: http://localhost:3000/admin/login

### 6. Admin Login Credentials

```
Email: admin@rahmaorganics.com
Password: admin123
```

## Testing the Application

### Test Customer Flow
1. Go to http://localhost:3000
2. Click "Shop Now"
3. Browse products
4. Add items to cart

### Test Admin Flow
1. Go to http://localhost:3000/admin/login
2. Login with admin credentials
3. View dashboard
4. Click "Manage Products"
5. Add/Edit/Delete products

### Test API Endpoints

```bash
# Get all products
curl http://localhost:5000/api/products

# Admin login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rahmaorganics.com","password":"admin123"}'
```

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify credentials in `backend/.env`
- Ensure database `rahma_organics` exists

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

## Next Steps

1. ✅ Customize product images
2. ✅ Set up M-Pesa credentials (see README.md)
3. ✅ Add more products via admin panel
4. ✅ Configure production database
5. ✅ Deploy to Vercel/Render

## Production Deployment

See README.md for detailed deployment instructions.
