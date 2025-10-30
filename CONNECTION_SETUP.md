# Full-Stack Connection Setup Guide

This guide explains how the frontend and backend are connected in the Expense Tracker application.

## 📁 Project Structure

```
/project-root
 ├── backend/
 │    ├── server.js          # Main Express server
 │    ├── .env               # Backend environment variables
 │    ├── config/
 │    │    └── db.js         # MongoDB connection
 │    ├── routes/            # API route handlers
 │    ├── models/            # Mongoose models
 │    ├── controllers/       # Business logic
 │    └── middleware/        # Express middleware
 ├── frontend/
 │    ├── src/
 │    │    ├── api/
 │    │    │    └── axios.js # Axios configuration
 │    │    ├── pages/
 │    │    │    └── BackendTest.tsx # Test page
 │    │    └── App.tsx       # React Router setup
 │    ├── .env               # Frontend environment variables
 │    └── vite.config.ts     # Vite configuration
 └── CONNECTION_SETUP.md     # This file
```

## 🔧 Configuration Details

### Backend Configuration (Port: 5000)

**Location:** `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/expense-tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration (Port: 5173)

**Location:** `frontend/.env`

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### Vite Configuration

**Location:** `frontend/vite.config.ts`

```typescript
server: {
  host: "::",
  port: 5173,  // Changed from 8080 to 5173
}
```

## 🔗 Connection Architecture

### Backend (Express)

1. **CORS Configuration** - Located in `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true
   }));
   ```

2. **Test API Endpoint** - Created at `/api/test`:
   ```javascript
   app.get('/api/test', (req, res) => {
     res.status(200).json({
       success: true,
       message: 'Backend connected successfully',
       timestamp: new Date().toISOString(),
     });
   });
   ```

3. **MongoDB Connection** - Configured in `backend/config/db.js`

### Frontend (React + Vite)

1. **Axios Setup** - Located in `frontend/src/api/axios.js`:
   - Base URL: `http://localhost:5000/api`
   - Automatic token injection via interceptors
   - Global error handling

2. **Test Page** - Created at `frontend/src/pages/BackendTest.tsx`
   - Automatically tests connection on page load
   - Displays connection status
   - Shows API response data

## 🚀 Running the Application

### Step 1: Start MongoDB

```bash
# If MongoDB is installed locally
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

### Step 2: Start Backend

```bash
cd backend
npm install  # if not already done
npm run server  # or npm start
```

The backend will start on `http://localhost:5000`

### Step 3: Start Frontend

```bash
cd frontend
npm install  # if not already done
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🧪 Testing the Connection

### Option 1: Test Page

Navigate to: `http://localhost:5173/test-backend`

This page will:
- Automatically attempt to connect to the backend
- Display success/error messages
- Show the API response
- Display configuration details

### Option 2: Browser Console

```javascript
// In browser console (from frontend)
fetch('http://localhost:5000/api/test')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Option 3: cURL

```bash
curl http://localhost:5000/api/test
```

Expected response:
```json
{
  "success": true,
  "message": "Backend connected successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🔐 API Configuration

### API Base URL

The frontend uses the environment variable `VITE_API_URL` to determine the backend URL.

**Frontend:** `http://localhost:5173`
**Backend:** `http://localhost:5000`
**API Base:** `http://localhost:5000/api`

### CORS Handling

The backend is configured to accept requests from `http://localhost:5173` only, preventing CORS errors.

### Authentication

- Tokens are automatically added to API requests via Axios interceptors
- Stored in `localStorage` as `token`
- Automatic redirect to login on 401 errors

## 📊 API Endpoints

### Test Endpoints
- `GET /api/test` - Test backend connection
- `GET /api/health` - Health check

### Application Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `GET /api/reminders` - Get user reminders
- `GET /api/income` - Get user income data

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution:** Ensure `FRONTEND_URL` in `backend/.env` matches the frontend port (5173)

### Issue: Connection Refused

**Checklist:**
1. Backend is running on port 5000
2. Frontend is running on port 5173
3. MongoDB is running (local or Atlas)
4. `.env` files are configured correctly

### Issue: 404 Not Found

**Solution:** Verify the API endpoint exists in `backend/server.js` and the route is properly configured

### Issue: Environment Variables Not Loading

**Solution:** 
- Restart the development server after changing `.env` files
- For Vite, variables must start with `VITE_` prefix
- Check that `.env` files are in the correct directories

## 📝 Additional Notes

- The application uses Socket.io for real-time updates
- All sensitive data should be stored in `.env` files (not committed to git)
- Use `env.example` files as templates for environment configuration
- Production deployments will require updating both frontend and backend URLs

## ✅ Checklist

Before deploying or sharing:

- [ ] Backend `.env` file is configured
- [ ] Frontend `.env` file is configured
- [ ] CORS is properly configured
- [ ] MongoDB connection is working
- [ ] Test endpoint returns successful response
- [ ] Frontend can successfully call backend APIs
- [ ] No console errors in browser
- [ ] No errors in backend terminal

