# 🛠️ JoTech Gadgets Hub - Backend API

Complete Node.js/Express backend for the JoTech Gadgets e-commerce platform.

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Setup Environment Variables**
Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required Variables:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Random string for JWT signing
- `EMAIL_USER` & `EMAIL_PASSWORD` - Gmail app password
- `FLUTTERWAVE_SECRET_KEY` & `FLUTTERWAVE_PUBLIC_KEY` - Payment gateway keys

### 3. **Seed Database**
```bash
npm run seed
```

This creates:
- 12 sample products
- Default admin account (admin@jotech.com)
- Sample customer account

### 4. **Start Server**
```bash
npm start
```
Or for development (auto-reload):
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── server.js              # Express server & routes setup
├── models.js              # Mongoose schemas (Product, Order, User, etc.)
├── package.json           # Dependencies & scripts
├── .env.example           # Environment template
│
├── routes/
│   ├── products.js        # Product CRUD endpoints
│   ├── orders.js          # Order management & email notifications
│   ├── payments.js        # Flutterwave payment integration
│   ├── auth.js            # User registration & login (JWT)
│   └── admin.js           # Admin dashboard data
│
├── utils/
│   └── email.js           # Nodemailer email templates
│
├── scripts/
│   └── seedProducts.js    # Database initialization script
│
└── admin/
    ├── login.html         # Admin login page
    └── index.html         # Admin dashboard (manage products, orders, etc.)
```

---

## 🔌 API Endpoints

### **Products**
```
GET     /api/products              List all products
GET     /api/products/:id          Get single product
POST    /api/products              Create product (admin)
PUT     /api/products/:id          Update product (admin)
DELETE  /api/products/:id          Delete product (admin)
```

### **Orders**
```
POST    /api/orders                Create order (+ stock deduction)
GET     /api/orders/customer/:email Get customer's orders
GET     /api/orders/admin/all      All orders (admin)
PUT     /api/orders/:id            Update order status (admin)
```

### **Payments** (Flutterwave)
```
POST    /api/payments/initialize   Start payment session
POST    /api/payments/verify/:txId Verify payment success
POST    /api/payments/webhook      Payment webhook handler
```

### **Authentication**
```
POST    /api/auth/register         Create customer account
POST    /api/auth/login            Authenticate & get JWT
GET     /api/auth/verify           Validate token
```

### **Admin**
```
GET     /api/admin/stats           Dashboard KPIs
GET     /api/admin/orders/recent   Last 10 orders
GET     /api/admin/appointments    All appointments
PUT     /api/admin/appointments/:id Confirm appointment
GET     /api/admin/newsletter      Newsletter subscribers
GET     /api/admin/low-stock       Products under 5 units
GET     /api/admin/revenue-chart   Monthly revenue
```

---

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/admin/stats
```

**Admin Routes Require:**
- Valid JWT token
- User role = "admin"

---

## 💳 Payment Flow

1. Customer adds items to cart, proceeds to checkout
2. Frontend calls `/api/payments/initialize` with order details
3. Backend creates order (status: "pending") and returns Flutterwave URL
4. Customer completes payment on Flutterwave
5. Flutterwave sends webhook to `/api/payments/webhook`
6. Order status updated to "paid"
7. Email confirmation sent to customer

**Flutterwave Test Cards:**
- Mastercard: 5531886652142950 (CVV: 564, Expiry: 09/32)
- Visa: 4187427415564246 (CVV: 828, Expiry: 09/32)

---

## 📧 Email Notifications

Automated emails sent for:
- ✅ Order confirmation
- ✅ Payment received
- ✅ Order shipped
- ✅ Order delivered
- ✅ Appointment confirmation

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use 16-character password in `.env` as `EMAIL_PASSWORD`

---

## 📦 Database Models

### **Product**
```json
{
  "name": "iPhone 15 Pro Max",
  "price": 299999,
  "stock": 15,
  "category": "Smartphones",
  "description": "Latest iPhone with A17 Pro chip",
  "image": "image_url",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### **Order**
```json
{
  "orderNumber": "JT-20240115-001",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "items": [
    {
      "productId": "...",
      "productName": "iPhone 15",
      "quantity": 1,
      "price": 299999
    }
  ],
  "totalAmount": 299999,
  "status": "paid",
  "paymentStatus": "paid",
  "transactionRef": "flw_123456",
  "shippingAddress": "123 Main St, Lagos",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### **User**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+234-8012345678",
  "password": "hashed_password",
  "role": "customer",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### **Appointment**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+234-8012345678",
  "service": "Device Consultation",
  "date": "2024-01-20T14:00:00Z",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### **Newsletter**
```json
{
  "email": "subscriber@example.com",
  "subscribedAt": "2024-01-15T10:30:00Z"
}
```

---

## 🛡️ Security Features

✅ **JWT Authentication** - Token-based API access
✅ **Password Hashing** - bcryptjs (10 salt rounds)
✅ **CORS Protection** - Whitelist allowed origins
✅ **Request Validation** - Mongoose schema validation
✅ **Stock Management** - Prevent overselling
✅ **Role-Based Access** - Admin-only endpoints

---

## 🚀 Deployment

### **Vercel** (Recommended for Node.js)
```bash
npm install -g vercel
vercel login
vercel
```

### **Railway**
1. Connect GitHub repo
2. Add environment variables
3. Deploy

### **Heroku** (Classic)
```bash
heroku create
heroku addons:create mongolab
git push heroku main
```

**Set Environment Variables:**
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
# ... (all other variables)
```

---

## 🔧 Troubleshooting

### MongoDB Connection Failed
- Check `.env` has correct `MONGODB_URI`
- Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0 or add your IP)
- Test connection: `mongodb+srv://user:pass@cluster.mongodb.net/jotech`

### Emails Not Sending
- Verify Gmail app password (16 characters)
- Check 2FA is enabled on Gmail account
- Test with: `npm run test-email`

### Payment Gateway Issues
- Verify Flutterwave keys in `.env`
- Check webhook URL is set in Flutterwave dashboard
- Use test cards for development

### CORS Errors
- Update `FRONTEND_URL` in `.env`
- Ensure backend allows your frontend origin

---

## 📊 Monitoring

Check real-time data via:

1. **MongoDB Atlas Dashboard**
   - Cluster performance
   - Data size & usage
   - Connection metrics

2. **Admin Dashboard**
   - Orders, revenue, products
   - Inventory levels
   - Appointments

3. **Flutterwave Dashboard**
   - Payment transactions
   - Settlement status
   - Revenue analytics

---

## 🤝 Support

**Issues?**
1. Check logs: Terminal output or deployment logs
2. Verify `.env` configuration
3. Test with postman: https://www.postman.com
4. Contact: admin@jotech.com

---

## 📝 License

Proprietary - JoTech Gadgets Hub

---

## 🎉 Ready to Deploy?

1. ✅ MongoDB Atlas setup
2. ✅ Flutterwave account configured
3. ✅ Gmail app password generated
4. ✅ `.env` file filled with all keys
5. ✅ Database seeded with `npm run seed`
6. ✅ Server tested locally: `npm run dev`

**Then deploy to Vercel/Railway/Heroku!** 🚀
