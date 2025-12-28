# Expense Tracker - Setup Guide

This guide will help you set up both the frontend and backend of the Expense Tracker application.

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (installed and running)
- npm or yarn

## 🔧 Backend Setup

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Copy the example file and modify as needed:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### 4. Make sure MongoDB is running

Start MongoDB service on your system.

### 5. Start the backend server

```bash
npm run server
```

The server will start on `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies (including axios)

```bash
npm install
```

### 3. Create a `.env` file (optional)

For custom backend URL:

```bash
# .env
VITE_API_URL=http://localhost:5000/api
```

If not set, it defaults to `http://localhost:5000/api`.

### 4. Start the frontend development server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🚀 Running the Complete Application

### Terminal 1 - Backend

```bash
cd backend
npm run server
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

## 📡 API Endpoints

### Authentication (`http://localhost:5000/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (requires auth)
- `POST /logout` - Logout user (requires auth)

### Transactions (`http://localhost:5000/api/transactions`)

- `GET /` - Get all transactions (requires auth)
- `GET /:id` - Get single transaction (requires auth)
- `POST /` - Create transaction (requires auth)
- `PUT /:id` - Update transaction (requires auth)
- `DELETE /:id` - Delete transaction (requires auth)
- `GET /stats/summary` - Get stats (requires auth)

### Reminders (`http://localhost:5000/api/reminders`)

- `GET /` - Get all reminders (requires auth)
- `GET /:id` - Get single reminder (requires auth)
- `POST /` - Create reminder (requires auth)
- `PUT /:id` - Update reminder (requires auth)
- `DELETE /:id` - Delete reminder (requires auth)
- `GET /date/:date` - Get reminders by date (requires auth)

## 🗄️ Database Models

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (optional)
}
```

### Transaction

```javascript
{
  user: ObjectId,
  type: 'income' | 'expense',
  category: String,
  amount: Number,
  description: String,
  date: String
}
```

### Reminder

```javascript
{
  user: ObjectId,
  recipient: String,
  amount: Number,
  date: String,
  time: String,
  note: String (optional),
  repeat: 'none' | 'daily' | 'weekly' | 'monthly',
  notified: Boolean
}
```

## 🧪 Testing the API

You can use tools like Postman or curl to test the API:

### Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get transactions (with auth token)

```bash
curl http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎯 Features

- ✅ JWT-based authentication
- ✅ User registration and login
- ✅ Transaction management (CRUD)
- ✅ Reminder management (CRUD)
- ✅ Real-time updates with Socket.io
- ✅ Protected routes
- ✅ Input validation
- ✅ Error handling
- ✅ Request logging

## 🐛 Troubleshooting

### MongoDB connection issues

Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### Port already in use

If port 5000 is in use, change it in your `.env` file.

### CORS errors

Make sure the `FRONTEND_URL` in your backend `.env` matches your frontend URL.

## 📝 Notes

- The backend uses MongoDB for data persistence
- All sensitive operations require JWT authentication
- Tokens are stored in localStorage on the frontend
- The frontend makes API calls to the backend for all operations

