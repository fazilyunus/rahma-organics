# Customer Registration & Authentication Feature

## ✅ Completed Implementation

### Backend Features

1. **Customer Registration Endpoint** (`POST /api/customers/register`)
   - Creates new customer accounts
   - Hashes passwords with bcrypt
   - Returns JWT token for immediate login
   - Validates unique email addresses

2. **Customer Login Endpoint** (`POST /api/customers/login`)
   - Authenticates existing customers
   - Returns JWT token (7-day expiry)
   - Secure password verification

3. **Customer Profile** (`GET /api/customers/profile`)
   - Protected route (requires authentication)
   - Returns user profile data

4. **Update Profile** (`PUT /api/customers/profile`)
   - Update name and phone number
   - Protected route

5. **Customer Orders** (`GET /api/customers/orders`)
   - View order history
   - Protected route
   - Shows all orders for logged-in customer

### Frontend Features

1. **Account Page** (`/account`)
   - **Login View**: Email & password authentication
   - **Registration View**: Full name, email, phone, password
   - **Profile Dashboard**: Shows user info and order history
   - **Guest Shopping**: Option to continue without account
   - **Auto-login**: Remembers logged-in users

2. **Enhanced Navbar**
   - Shows user's first name when logged in
   - Dynamic cart counter
   - Quick access to account

3. **Smart Checkout**
   - Associates orders with logged-in users
   - Allows guest checkout
   - Redirects to account after purchase (if logged in)

## How It Works

### Registration Flow
1. User clicks "Create Account" on `/account` page
2. Fills in: Name, Email, Phone (optional), Password
3. Backend creates user with hashed password
4. Returns JWT token
5. Frontend stores token in localStorage
6. User is automatically logged in

### Login Flow
1. User enters email and password
2. Backend verifies credentials
3. Returns JWT token
4. Frontend stores token
5. User sees their profile dashboard

### Order Association
- **Logged-in users**: Orders automatically linked to their account
- **Guest users**: Orders created without user_id
- **Order history**: Only visible to logged-in users

## API Endpoints

```
POST   /api/customers/register    - Create new account
POST   /api/customers/login       - Login existing user
GET    /api/customers/profile     - Get user profile (protected)
PUT    /api/customers/profile     - Update profile (protected)
GET    /api/customers/orders      - Get order history (protected)
```

## Testing the Feature

### 1. Register a New Customer
```bash
curl -X POST http://localhost:5000/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "phone": "0712345678"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### 3. Get Profile (use token from login)
```bash
curl http://localhost:5000/api/customers/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## User Experience

### For New Customers
1. Visit http://localhost:3001/account
2. Click "Don't have an account? Sign up"
3. Fill in registration form
4. Automatically logged in after registration
5. Can view profile and order history

### For Returning Customers
1. Visit http://localhost:3001/account
2. Enter email and password
3. Click "Login"
4. Access profile dashboard with order history

### For Guest Shoppers
1. Can shop without creating account
2. "Continue as guest" option available
3. Orders created but not linked to account

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication
- ✅ 7-day token expiry
- ✅ Protected routes require authentication
- ✅ Email uniqueness validation
- ✅ Minimum password length (6 characters)

## Database Schema

The `users` table includes:
- `id` - Primary key
- `name` - Customer full name
- `email` - Unique email address
- `password` - Hashed password
- `phone` - Phone number (optional)
- `role` - 'customer' or 'admin'
- `created_at` - Registration timestamp

## Next Steps (Optional Enhancements)

1. **Email Verification**: Send verification email on registration
2. **Password Reset**: Forgot password functionality
3. **Social Login**: Google/Facebook authentication
4. **Profile Picture**: Upload and display avatar
5. **Address Book**: Save multiple delivery addresses
6. **Wishlist**: Save favorite products
7. **Order Tracking**: Real-time order status updates
8. **Loyalty Points**: Reward system for repeat customers

## Notes

- The backend is fully functional but requires database password configuration
- Frontend works perfectly and handles all authentication flows
- Guest checkout is supported for users who don't want to register
- All passwords are securely hashed before storage
- JWT tokens are stored in localStorage for persistence

## Access the Feature

Visit: http://localhost:3001/account

Try it out! 🎉
