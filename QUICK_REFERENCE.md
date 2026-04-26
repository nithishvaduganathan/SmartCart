# SmartCart Quick Reference Guide

## 🚀 Start Development

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173 or http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/

---

## 🔑 Admin Access

**URL:** http://localhost:8000/admin/

**Default Credentials:**
- Username: `admin`
- Password: (created during setup with `createsuperuser`)

---

## 📚 Common Commands

### Backend

```bash
# Create database tables
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Create sample data
python manage.py shell
>>> from api.models import *
>>> Category.objects.create(name="Electronics", slug="electronics")
>>> Product.objects.create(name="Phone", price=50000, stock=10, category=category_obj)

# Collect static files (production)
python manage.py collectstatic

# Run tests
python manage.py test

# Check for security issues
python manage.py check --deploy
```

### Frontend

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🧪 Test Payment Flow

1. **Register:** http://localhost:5173/register
2. **Login:** http://localhost:5173/login
3. **Browse Products:** http://localhost:5173/
4. **Add to Cart:** Click products
5. **Go to Cart:** http://localhost:5173/cart
6. **Checkout:** Click "Proceed to Checkout"
7. **Payment:** Enter test card details:
   - Card: `4111 1111 1111 1111`
   - Expiry: `12/25`
   - CVV: `123`

---

## 🔧 Configuration Files

### Backend .env

```
SECRET_KEY=django-insecure-your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_SECRET_KEY=xxxxx
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend .env

```
VITE_API_URL=http://localhost:8000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

## 🐛 Debugging

### Backend Issues

```bash
# Check database connection
python manage.py dbshell

# See API responses in detail
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/products/

# Enable debug toolbar
pip install django-debug-toolbar
# Add to INSTALLED_APPS in settings.py
```

### Frontend Issues

```bash
# Check browser console (F12)
# Check Network tab for API calls
# Clear cache: Ctrl+Shift+Delete
```

### Razorpay Issues

```bash
# Check payment logs in Razorpay Dashboard
# Verify test mode is enabled
# Check .env has correct keys
```

---

## 🔐 Security Checklist

**Before Deployment:**
- [ ] Change `SECRET_KEY` to random string
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_HOSTS`
- [ ] Use PostgreSQL (not SQLite)
- [ ] Setup HTTPS/SSL
- [ ] Verify email service credentials
- [ ] Use production Razorpay keys
- [ ] Check `python manage.py check --deploy`

---

## 📊 Admin Panel Quick Access

| Feature | URL | Note |
|---------|-----|------|
| Products | /admin/api/product/ | Add/edit products |
| Orders | /admin/api/order/ | Track orders |
| Users | /admin/auth/user/ | Manage users |
| Categories | /admin/api/category/ | Create categories |
| Payments | /admin/api/payment/ | View transactions |

---

## 🌐 API Quick Reference

### Typical Request Flow

```bash
# 1. Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user","email":"user@test.com","password":"pass123"}'

# 2. Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass123"}'

# 3. Get Products (with token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/products/

# 4. Add to Cart
curl -X POST http://localhost:8000/api/cart-items/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product":1,"quantity":1}'

# 5. Create Order
curl -X POST http://localhost:8000/api/orders/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"shipping_address":"123 Main St"}'
```

---

## 📱 Pages & Routes

### Customer Pages
| Route | Purpose |
|-------|---------|
| / | Landing page |
| /login | User login |
| /register | User registration |
| /cart | Shopping cart |
| /checkout | Checkout page |
| /payment/:orderId | Payment processing |
| /profile | User profile |

### Admin Pages
| Route | Purpose |
|-------|---------|
| /admin/dashboard | Dashboard stats |
| /admin/orders | Order management |
| /admin/products | Product management |
| /admin/users | User management |

---

## 📧 Email Configuration

### Gmail SMTP

1. Enable 2-factor authentication on Gmail
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use app password in .env:
   ```
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=generated-app-password
   ```

### SendGrid Alternative

```
EMAIL_BACKEND=sendgrid_backend.SendgridBackend
SENDGRID_API_KEY=your_sendgrid_key
```

---

## 🔄 Common Workflows

### Add New Product

```bash
# Option 1: Via Django Admin
# 1. Go to http://localhost:8000/admin/
# 2. Click Products
# 3. Click Add Product
# 4. Fill details and save

# Option 2: Via API
curl -X POST http://localhost:8000/api/products/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"New Product",
    "description":"Description",
    "price":999,
    "stock":10,
    "category_id":1
  }'
```

### Update Order Status

```bash
# Via API
curl -X PUT http://localhost:8000/api/admin/orders/1/status/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Shipped"}'

# Or via Django Admin
# 1. Go to http://localhost:8000/admin/api/order/
# 2. Select order
# 3. Change status and save
```

---

## 🆘 Quick Help

**Can't login?**
- Check credentials are correct
- Verify user exists in admin panel
- Check JWT token not expired

**Cart items not showing?**
- Check user is logged in
- Verify Cart exists for user
- Check browser local storage cleared

**Payment failing?**
- Verify Razorpay keys in .env
- Check test mode enabled in Razorpay
- Try different test card
- Check network tab for API errors

**Email not sending?**
- Check SMTP credentials in .env
- Verify Gmail allows app passwords
- Check email_backend in settings.py
- Check server logs for errors

---

## 📚 Useful Links

- **Django Docs:** https://docs.djangoproject.com/
- **DRF Docs:** https://www.django-rest-framework.org/
- **React Docs:** https://react.dev/
- **Razorpay Docs:** https://razorpay.com/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite Docs:** https://vitejs.dev/

---

## ⚡ Performance Tips

1. Use pagination for large lists
2. Enable Django caching for queries
3. Optimize images before upload
4. Use CDN for static files in production
5. Enable gzip compression
6. Monitor database queries with Django debug toolbar

---

**Last Updated:** 2026-04-25  
**For issues:** Check BUILD_SUMMARY.md, DEPLOYMENT.md, or README.md
