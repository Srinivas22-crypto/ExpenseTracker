# Expense Tracker Backend API

A robust Node.js + Express + MongoDB backend for the Expense Tracker application.

## Features

- 🔐 JWT-based authentication
- 💰 Transaction management (CRUD)
- 🔔 Reminder management (CRUD)
- 📊 Real-time updates with Socket.io
- 🛡️ Protected routes and error handling
- 📝 Request logging with Morgan
- 🔒 Data validation and sanitization

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout user (protected)

### Transactions (`/api/transactions`)
- `GET /` - Get all transactions (protected)
- `GET /:id` - Get single transaction (protected)
- `POST /` - Create transaction (protected)
- `PUT /:id` - Update transaction (protected)
- `DELETE /:id` - Delete transaction (protected)
- `GET /stats/summary` - Get transaction statistics (protected)

### Reminders (`/api/reminders`)
- `GET /` - Get all reminders (protected)
- `GET /:id` - Get single reminder (protected)
- `POST /` - Create reminder (protected)
- `PUT /:id` - Update reminder (protected)
- `DELETE /:id` - Delete reminder (protected)
- `GET /date/:date` - Get reminders for specific date (protected)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

3. Make sure MongoDB is running

4. Start the server:
```bash
npm start        # Production
npm run server   # Development with nodemon
```

## Project Structure

```
backend/
├── config/
│   └── db.js           # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── transactionController.js
│   └── reminderController.js
├── middleware/
│   ├── auth.js         # JWT authentication
│   ├── errorHandler.js # Error handling
│   └── requestLogger.js # Request logging
├── models/
│   ├── User.js
│   ├── Transaction.js
│   └── Reminder.js
├── routes/
│   ├── authRoutes.js
│   ├── transactionRoutes.js
│   └── reminderRoutes.js
├── utils/
│   ├── asyncHandler.js
│   ├── generateToken.js
│   ├── colors.js
│   └── socketEmitter.js
└── server.js
```

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Bcrypt** - Password hashing
- **Morgan** - HTTP request logger
- **Colors** - Terminal colors

## License

ISC

