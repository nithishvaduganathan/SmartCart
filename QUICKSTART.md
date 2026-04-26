# SmartCart - Quick Start Guide

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- PostgreSQL 12+ (for database)

## Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Update .env with your configuration
# DATABASE_URL=postgresql://user:password@localhost:5432/smartcart
# RAZORPAY_KEY_ID=your_key_id
# RAZORPAY_SECRET_KEY=your_secret_key
# SECRET_KEY=your_secret_key_for_jwt

# Create database (if using PostgreSQL)
# createdb smartcart

# Run migrations
alembic upgrade head

# Seed initial data (categories, products)
python scripts/seed_data.py
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:8000/api" > .env.local

# Start development server
npm run dev  # Runs on http://localhost:5173
```

### 3. Run Both Services

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get current user profile

### Products & Categories
- `GET /api/products/` - List all products
- `GET /api/categories/` - List all categories

### Cart Operations
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update item quantity
- `DELETE /api/cart/items/{id}` - Remove item from cart

### Orders & Payments
- `POST /api/orders/` - Create order from cart
- `GET /api/orders/` - Get user's orders
- `POST /api/payments/create-razorpay-order/` - Initialize payment
- `POST /api/payments/verify-payment/` - Verify payment

## Frontend Pages

| Page | Route | Purpose |
|------|-------|---------|
| Landing | `/` | Homepage with products showcase |
| Login | `/login` | User authentication |
| Register | `/register` | New user registration |
| Cart | `/cart` | View and manage cart items |
| Checkout | `/checkout` | Enter shipping details |
| Payment | `/payment/:orderId` | Process payment via Razorpay |
| Profile | `/profile` | User profile management |
| Dashboard | `/dashboard` | Order history and details |

## Testing the Application

### Test User Account
```
Username: testuser
Email: test@example.com
Password: testpass123
```

### Test Payment
- Use Razorpay test credentials:
  - Key ID: `rzp_test_1Aa00000000000`
  - Secret: `thisissecret`
- Card details: 4111 1111 1111 1111 (any future expiry, any CVV)

### Sample API Test
```bash
# Get all categories
curl http://localhost:8000/api/categories/

# Get all products
curl http://localhost:8000/api/products/

# Health check
curl http://localhost:8000/health
```

## Development Commands

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
# Run server
python -m uvicorn main:app --reload

# Run migrations
alembic upgrade head
alembic downgrade -1

# Create migration
alembic revision --autogenerate -m "description"

# Run tests (when configured)
pytest

# Format code
black .
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/smartcart
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET_KEY=your_secret_key
SECRET_KEY=your_jwt_secret_key
DEBUG=True
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000/api
VITE_RAZORPAY_KEY_ID=rzp_test_key
```

## Troubleshooting

### Backend won't start
```bash
# Check Python version (should be 3.10+)
python --version

# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check database connection
psql -U user -d smartcart -c "SELECT 1;"
```

### Frontend build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS errors
Update `CORS_ORIGINS` in backend main.py:
```python
allow_origins=["http://localhost:3000", "http://localhost:5173"]
```

### Database connection issues
```bash
# Check PostgreSQL is running
psql --version

# Verify connection string in .env
# Format: postgresql://username:password@hostname:port/database
```

## Production Deployment

### Build Frontend
```bash
npm run build
# Output in dist/ directory
```

### Deploy Backend
```bash
# Using gunicorn with uvicorn workers
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Or with Docker (recommended)
docker build -t smartcart-backend .
docker run -p 8000:8000 smartcart-backend
```

### Deploy Frontend
```bash
# Use any static hosting (Vercel, Netlify, AWS S3, etc.)
# Or serve from same server with nginx/Apache
```

## Next Steps

1. **Setup Database**: Configure PostgreSQL and update .env
2. **Add Test Data**: Seed database with categories and products
3. **Test Authentication**: Register and login with test accounts
4. **Test Payments**: Complete a test order with payment
5. **Deploy**: Follow production deployment steps

## Support & Resources

- **API Documentation**: Open `http://localhost:8000/docs` when backend is running
- **Code Issues**: Check `FIX_SUMMARY.md` for recent fixes
- **Deployment Guide**: See `DEPLOYMENT.md` for detailed deployment instructions

---

**Last Updated**: 2026-04-26
**Status**: Ready for Production
