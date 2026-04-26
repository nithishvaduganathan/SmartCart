# SmartCart Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Admin user created
- [ ] Razorpay keys added
- [ ] Email service configured
- [ ] Frontend .env variables set
- [ ] Static files collected
- [ ] Security settings verified

---

## 🔧 Environment Setup

### Backend (.env Production)
```
SECRET_KEY=your-production-secret-key-min-50-chars
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com
DATABASE_URL=postgres://user:password@host:port/dbname
RAZORPAY_KEY_ID=your_production_key
RAZORPAY_SECRET_KEY=your_production_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env Production)
```
VITE_API_URL=https://api.yourdomain.com/api
VITE_RAZORPAY_KEY_ID=your_production_key
VITE_APP_URL=https://yourdomain.com
```

---

## 🚀 Deployment Options

### Option 1: Render (Recommended for beginners)

**Backend Deployment:**

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your GitHub repository
5. Configure:
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - **Start Command:** `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`
6. Add environment variables in Render dashboard
7. Deploy

**Frontend Deployment:**

1. Create new Static Site
2. Connect GitHub repo (frontend folder)
3. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add environment variables
5. Deploy

### Option 2: AWS EC2

**Backend:**
```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Setup
sudo yum update -y
sudo yum install python3 python3-pip postgresql -y
git clone your-repo
cd SmartCart/backend
pip install -r requirements.txt

# Create .env file with production values
nano .env

# Run migrations
python manage.py migrate
python manage.py collectstatic --noinput

# Install & start Gunicorn
pip install gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

**Frontend:**
```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y

# Build & serve
cd SmartCart/frontend
npm install
npm run build

# Use Nginx to serve
sudo yum install nginx -y
# Copy dist files to /var/www/html
```

### Option 3: DigitalOcean App Platform

1. Connect GitHub repository
2. Create database (PostgreSQL)
3. Configure web service with build & start commands
4. Set environment variables
5. Deploy

### Option 4: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
- Import project
- Set root directory: `frontend`
- Build: `npm run build`
- Output: `dist`

**Backend on Railway:**
- Import project
- Set root directory: `backend`
- Build: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
- Start: `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`

---

## 🗄️ Database Setup

### PostgreSQL (Production Recommended)

1. Create PostgreSQL database
2. Update `DATABASE_URL`:
   ```
   DATABASE_URL=postgres://user:password@host:5432/smartcart_db
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```

### MySQL (Alternative)

```
DATABASE_URL=mysql://user:password@host:3306/smartcart_db
```

### SQLite (Development Only)

```
DATABASE_URL=sqlite:///db.sqlite3
```

---

## 🔐 Security Configuration

### Django Settings
```python
# settings.py for production
DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
ALLOWED_HOSTS = ['yourdomain.com', 'api.yourdomain.com']
```

### SSL Certificate

**Let's Encrypt (Free):**
```bash
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com
```

**Configure Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📊 Monitoring & Logging

### Sentry (Error Tracking)

1. Sign up at https://sentry.io
2. Create Django project
3. Add to requirements.txt:
   ```
   sentry-sdk==1.39.1
   ```
4. Configure in settings.py:
   ```python
   import sentry_sdk
   sentry_sdk.init(
       dsn="YOUR_SENTRY_DSN",
       traces_sample_rate=1.0,
   )
   ```

### Monitoring
- Monitor dashboard at your hosting provider
- Check logs regularly
- Setup alerts for errors

---

## 🔄 Continuous Integration/Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl https://api.render.com/deploy/srv-YOUR_SERVICE_ID?key=${{ secrets.RENDER_DEPLOY_KEY }}
```

---

## 📈 Performance Optimization

### Caching
```python
# Django cache configuration
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### CDN Setup
- Use CloudFlare for static files
- Enable image optimization
- Setup page caching

### Database Optimization
- Add indexes to frequently queried fields
- Use `select_related()` for foreign keys
- Implement pagination

---

## 🧪 Pre-Launch Testing

```bash
# Test locally with production settings
DEBUG=False python manage.py runserver

# Check for security issues
python manage.py check --deploy

# Test payment flow with Razorpay test keys
# Test user registration and email
# Test admin functionality
# Check API endpoints with Postman
```

---

## 📞 Troubleshooting

### 500 Errors
- Check server logs
- Run `python manage.py check --deploy`
- Verify database connection

### Database Connection Error
- Check DATABASE_URL format
- Verify credentials
- Check network/firewall settings

### Razorpay Payment Issues
- Verify API keys in .env
- Check Razorpay test mode
- Review payment logs in Razorpay dashboard

### Email Not Sending
- Verify SMTP settings
- Check Gmail app password (not regular password)
- Enable "Less secure app access" if using Gmail

---

## 📊 Deployment Checklist

**Before Going Live:**
- [ ] All environment variables set
- [ ] Database migrated
- [ ] Admin user created
- [ ] SSL certificate installed
- [ ] Static files served correctly
- [ ] Email configured and tested
- [ ] Razorpay keys verified
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Error tracking setup

---

## 🎯 Post-Deployment

1. **Monitor closely first week** - watch for errors and performance issues
2. **Backup database daily** - use your hosting provider's backup feature
3. **Monitor costs** - especially database and CDN usage
4. **Security updates** - keep dependencies updated
5. **Performance tuning** - optimize based on actual usage

---

**Need Help?**
- Backend issues: Check Django logs
- Frontend issues: Check browser console
- Payment issues: Check Razorpay dashboard
- Deployment issues: Check hosting provider documentation
