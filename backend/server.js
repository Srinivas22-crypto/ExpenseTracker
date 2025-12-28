const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const colors = require('./utils/colors');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportsRoutes = require('./routes/reportsRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Disable caching for API responses to prevent 304 requests
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Request logger
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  // Join user room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Leave user room
  socket.on('leave-user-room', (userId) => {
    socket.leave(`user-${userId}`);
    console.log(`User ${userId} left their room`);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Test route to verify backend connection
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend connected successfully',
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `\n🚀 Server running on port ${PORT}`.yellow.bold,
    `\n📝 Environment: ${process.env.NODE_ENV || 'development'}`.cyan,
    `\n🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`.blue,
    `\n`
  );
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`.yellow);
  
  // Close HTTP server (stop accepting new connections)
  server.close(() => {
    console.log('✅ HTTP server closed'.green);
    
    // Close Socket.io server
    io.close(() => {
      console.log('✅ Socket.io server closed'.green);
      
      // Close MongoDB connection
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        mongoose.connection.close(false, () => {
          console.log('✅ MongoDB connection closed'.green);
          console.log('👋 Server shutdown complete'.cyan);
          process.exit(0);
        });
      } else {
        console.log('✅ MongoDB connection already closed'.green);
        console.log('👋 Server shutdown complete'.cyan);
        process.exit(0);
      }
    });
  });
  
  // Force shutdown after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout'.red);
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`.red);
  console.error(err.stack);
  gracefulShutdown('uncaughtException');
});

module.exports = { app, server, io };

