const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  description: String,
  category: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    qty: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: String,
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'failed'], default: 'unpaid' },
  transactionRef: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

const AppointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  date: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const NewsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

module.exports = {
  Product: mongoose.model('Product', ProductSchema),
  Order: mongoose.model('Order', OrderSchema),
  User: mongoose.model('User', UserSchema),
  Appointment: mongoose.model('Appointment', AppointmentSchema),
  Newsletter: mongoose.model('Newsletter', NewsletterSchema)
};
