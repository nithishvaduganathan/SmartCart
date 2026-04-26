# SmartCart - Complete E-Commerce Platform Setup & Features Guide

## 🚀 New Features Implemented

### 1. Professional Product Detail Page
- **Route**: `/products/:id`
- **Features**:
  - High-quality product image display with hover zoom
  - Full product description and specifications
  - Stock status indicator
  - Quantity selector with +/- controls
  - "Add to Cart" button for cart management
  - "Buy Now" button for quick checkout
  - Related products from same category
  - Professional dark theme with animations
  - Category badge and product ratings placeholder

### 2. Discount & Coupon System
- **Admin Endpoints**: `/api/admin/discounts/`
  - Create discount codes with GET, POST, PUT, DELETE
  - Manage discount type (percentage or fixed amount)
  - Set usage limits, minimum order amounts
  - Track usage count and active status

- **Customer Endpoints**: `/api/discounts/validate/`
  - Validate coupon codes
  - Check discount eligibility
  - Calculate final amount with discount

- **Frontend Integration**:
  - Coupon input in Cart page
  - Coupon input in Checkout page
  - Real-time discount calculation
  - Visual discount display in order summary
  - Apply/remove discount functionality

### 3. Enhanced Shopping Cart
- Discount code input and validation
- Order summary with discount breakdown
- Display savings amount
- Apply/remove discount before checkout

### 4. Enhanced Checkout Flow
- Professional checkout form with address, email, phone
- Discount code application at checkout
- Price breakdown showing subtotal, discount, and final total
- Seamless transition to payment

### 5. Improved Product Cards
- "View Details" button on hover
- Stock status badge
- Professional styling with animations
- Link to product detail page
- Category information display

### 6. Order Management Enhancements
- Discount code stored in orders
- Discount amount calculated and stored
- Order timestamps (created_at, updated_at)
- Price calculations include discounts

## 🔧 Backend Setup

### Database
The application uses SQLite by default (smartcart.db). When the backend starts, it automatically creates all tables including:
- New `Discount` table with fields:
  - `code` (unique coupon code)
  - `discount_type` (percentage or fixed)
  - `discount_value` (discount amount)
  - `max_uses` (usage limit, 0 for unlimited)
  - `uses_count` (current usage count)
  - `min_order_amount` (minimum order value)
  - `is_active` (active/inactive status)
  - `created_at`, `updated_at` (timestamps)

- Updated `Order` table with fields:
  - `discount_code` (applied coupon code)
  - `discount_amount` (calculated discount)
  - `updated_at` (last updated timestamp)

### Running the Backend

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables** (.env file):
   ```
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_SECRET_KEY=your_razorpay_secret
   DATABASE_URL=sqlite:///./smartcart.db
   ```

4. **Run the server**:
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The server starts at `http://localhost:8000`
   API docs available at `http://localhost:8000/docs`

## 🎨 Frontend Setup

### Running the Frontend

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables** (.env file):
   ```
   VITE_API_URL=http://localhost:8000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   VITE_ADMIN_USERS=admin,admin2
   VITE_ADMIN_EMAILS=admin@example.com
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   Frontend available at `http://localhost:5173`

## 📋 Complete User Flow

### 1. Landing Page
- View hero section with features and testimonials
- Browse featured products
- Filter by category
- Click "Shop Now" or "Create Account"

### 2. Registration
- Navigate to `/register`
- Create account with username, email, password
- Redirects to dashboard after registration

### 3. Product Browsing
- **List View** (`/products`):
  - Search products by name/description
  - Filter by category
  - Sort by: newest, price (asc/desc), name
  - Pagination (12 items per page)

- **Detail View** (`/products/:id`):
  - Click product card to view details
  - See full description and images
  - Select quantity
  - "Add to Cart" or "Buy Now"
  - View related products

### 4. Shopping Cart (`/cart`)
- Review selected items
- Adjust quantities
- Remove items
- **Apply Discount Code**:
  - Enter coupon code
  - Click "Apply"
  - See discount calculation
  - Remove discount if needed
- Enter shipping address
- Click "Place Order"

### 5. Checkout (`/checkout`)
- Enter email and phone
- Confirm shipping address
- **Apply Discount Code** (alternative location)
- Review order items
- See price breakdown
- Click "Proceed to Payment"

### 6. Payment (`/payment/:orderId`)
- Review order details with discount applied
- Click "Pay with Razorpay"
- Complete payment in Razorpay modal
- Return to dashboard

### 7. Order Confirmation
- View order history in dashboard
- See all orders with prices (including discounts)
- Track order status

## 🔐 Admin Features

### Admin Login
- Same login page as normal users
- Admin status determined by:
  - Username in `VITE_ADMIN_USERS` environment variable
  - Email in `VITE_ADMIN_EMAILS` environment variable

### Admin Dashboard (`/admin/dashboard`)
- View dashboard metrics
- Recent orders overview

### Admin Products (`/admin/products`)
- Add new products (name, description, price, stock, category, image URL)
- Edit existing products
- Delete products
- Search and filter products

### Admin Orders (`/admin/orders`)
- View all customer orders
- Update order status (Pending, Paid, Shipped, Delivered, Cancelled)
- View order details with discounts applied

### **NEW: Admin Discount Management** (API Only - Endpoint: `/api/admin/discounts/`)
- Create discount codes:
  ```bash
  POST /api/admin/discounts/
  {
    "code": "SAVE20",
    "discount_type": "percentage",
    "discount_value": 20,
    "max_uses": 100,
    "min_order_amount": 500,
    "is_active": true
  }
  ```

- Get all discount codes:
  ```bash
  GET /api/admin/discounts/
  ```

- Update discount code:
  ```bash
  PUT /api/admin/discounts/{discount_id}
  ```

- Delete discount code:
  ```bash
  DELETE /api/admin/discounts/{discount_id}
  ```

## 🧪 Testing the Discount System

### 1. Create a Test Discount Code
```bash
curl -X POST http://localhost:8000/api/admin/discounts/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TESTDISCOUNT",
    "discount_type": "percentage",
    "discount_value": 10,
    "max_uses": 5,
    "min_order_amount": 100,
    "is_active": true
  }'
```

### 2. Test Discount Validation
```bash
curl -X POST http://localhost:8000/api/discounts/validate/ \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TESTDISCOUNT",
    "order_amount": 500
  }'
```

### 3. Apply Discount During Order Creation
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "123 Main St, City, State, Zip",
    "discount_code": "TESTDISCOUNT"
  }'
```

## 📁 New Files Added

### Backend
- `/backend/app/routes/discounts.py` - Discount API endpoints
- Database: Updated Discount model added to `/backend/app/models.py`
- Schemas: Updated Order schema in `/backend/app/schemas.py`
- Routes: Updated orders endpoint in `/backend/app/routes/orders.py`

### Frontend
- `/frontend/src/pages/ProductDetail.jsx` - Product detail page
- Updated `CartContext.jsx` - Discount state management
- Updated `Cart.jsx` - Discount code input
- Updated `Checkout.jsx` - Discount support
- Updated `Payment.jsx` - Discount display
- Updated `ProductCard.jsx` - Enhanced with detail link
- Updated `App.jsx` - Product detail route

## 🎯 Key Technologies

**Backend**:
- FastAPI (Python framework)
- SQLAlchemy ORM
- SQLite database
- Razorpay payment SDK
- JWT authentication

**Frontend**:
- React 18+
- React Router v6
- TailwindCSS
- Framer Motion (animations)
- Axios for HTTP requests
- Lucide React icons

## ✨ Features Highlights

✅ Professional, fully functional e-commerce platform
✅ Product detail pages with full descriptions and images
✅ Flexible discount/coupon system (percentage or fixed amount)
✅ Usage tracking for coupon codes
✅ Minimum order amount validation for discounts
✅ Real-time discount calculation
✅ Order history with discount information
✅ Admin dashboard for managing discounts
✅ Professional dark theme with animations
✅ Responsive design for all devices
✅ Secure payment with Razorpay
✅ Complete user authentication and authorization

## 🔄 Complete Flow Diagram

```
Landing Page
    ↓
Register/Login
    ↓
Browse Products (List)
    ↓
View Product Details
    ↓
Add to Cart / Buy Now
    ↓
Shopping Cart (Optional: Apply Discount)
    ↓
Checkout (Optional: Apply/Change Discount)
    ↓
Payment (Razorpay)
    ↓
Order Confirmation
    ↓
Dashboard (View Order History)
```

## 🚨 Notes

- All discount codes are case-insensitive (stored in uppercase)
- Discount usage count increments on successful order creation
- Orders store the discount code and amount for historical tracking
- Product detail page loads related products from the same category
- Discount validation checks: code exists, is active, has uses remaining, meets minimum order amount

## 📞 Support

For issues or questions about the new features:
1. Check API documentation at `http://localhost:8000/docs`
2. Review error messages in response
3. Check browser console for frontend errors
4. Verify environment variables are set correctly
