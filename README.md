# 🛒 Nexa Cart - Modern E-Commerce Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/gauravgautam2003/Nexa_Cart)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Nexa Cart is a full-featured e-commerce platform designed to provide a seamless shopping experience. Inspired by leading platforms like Flipkart, Amazon, and Meesho, Nexa Cart brings modern web technologies together to create a scalable and user-friendly online shopping ecosystem.

## ✨ Features

- 🛍️ **Product Catalog** - Browse extensive product collections with advanced filtering
- 🔍 **Smart Search** - Find products quickly with intelligent search functionality
- 🛒 **Shopping Cart** - Add, remove, and manage items in your cart
- 💳 **Secure Checkout** - Safe and secure payment processing
- 👤 **User Authentication** - Sign up, login, and manage user profiles
- 📱 **Responsive Design** - Seamless experience across all devices
- ⭐ **Product Reviews** - Read and write product reviews and ratings
- 💝 **Wishlist** - Save favorite items for later
- 📦 **Order Management** - Track your orders and delivery status
- 🎯 **Personalized Recommendations** - AI-powered product suggestions

## 🚀 Tech Stack

| Frontend | Backend | Database | Tools |
|----------|---------|----------|-------|
| TypeScript | Node.js | MongoDB | Git |
| React/Next.js | Express | Redis | Docker |
| Redux Toolkit | JWT Auth | PostgreSQL | GitHub |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **MongoDB** or **PostgreSQL** (depending on configuration)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/gauravgautam2003/Nexa_Cart.git
cd Nexa_Cart
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/nexa_cart
# OR
DATABASE_URL=postgresql://user:password@localhost:5432/nexa_cart

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# API Keys
STRIPE_API_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Run the Application

```bash
# Development Mode
npm run dev

# Production Build
npm run build
npm start
```

## 📚 Project Structure

```
Nexa_Cart/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── styles/           # CSS/SCSS files
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── redux/            # Redux store and slices
│   ├── api/              # API integration
│   └── types/            # TypeScript type definitions
├── server/
│   ├── routes/           # API routes
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
├── public/               # Static assets
├── .env.example          # Environment template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md            # This file
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ HTTPS ready

## 📖 API Documentation

### Authentication Endpoints

```
POST /api/auth/register      - Register new user
POST /api/auth/login         - User login
POST /api/auth/logout        - User logout
POST /api/auth/refresh-token - Refresh JWT token
```

### Product Endpoints

```
GET /api/products            - Get all products
GET /api/products/:id        - Get product details
POST /api/products/search    - Search products
GET /api/products/category/:cat - Get products by category
```

### Cart Endpoints

```
GET /api/cart                - Get user's cart
POST /api/cart/add           - Add item to cart
PUT /api/cart/update         - Update cart item
DELETE /api/cart/remove      - Remove from cart
```

### Order Endpoints

```
POST /api/orders             - Create order
GET /api/orders              - Get user's orders
GET /api/orders/:id          - Get order details
PUT /api/orders/:id/status   - Update order status
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/components/Product.test.tsx
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a new branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes and commit them (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and focused

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports

Found a bug? Please [create an issue](https://github.com/gauravgautam2003/Nexa_Cart/issues) with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs (if applicable)

## 💡 Feature Requests

Have an idea? [Open a discussion](https://github.com/gauravgautam2003/Nexa_Cart/discussions) or create an issue with the `feature-request` label.

## 📞 Support

For questions and support:
- 📧 Email: gauravgautam2003@gmail.com
- 💬 GitHub Issues: [Create an issue](https://github.com/gauravgautam2003/Nexa_Cart/issues)
- 📱 GitHub Discussions: [Start a discussion](https://github.com/gauravgautam2003/Nexa_Cart/discussions)

## 🙏 Acknowledgments

- Inspired by Flipkart, Amazon, and Meesho
- Built with ❤️ by [Gaurav Gautam](https://github.com/gauravgautam2003)
- Thanks to all contributors and supporters

## 📊 Project Status

🚀 **Active Development** - The project is actively being developed with regular updates and new features.

---

**Made with ❤️ by Gaurav Gautam**

⭐ If you find this project helpful, please consider giving it a star!
