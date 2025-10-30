# Quick Start Guide

## 🚀 Get the Application Running

### Prerequisites
- Node.js installed
- MongoDB running (local or Atlas)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Test Connection: http://localhost:5173/test-backend

## 🧪 Test the Connection

Visit http://localhost:5173/test-backend to verify the frontend-backend connection.

Expected result: ✅ "Backend connected successfully" message

## 📖 Full Documentation

See [CONNECTION_SETUP.md](./CONNECTION_SETUP.md) for detailed documentation.

