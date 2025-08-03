const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Import database connection
const sequelize = require('./config/database');

// Import models
const { User, Company, IPO, ActivityLog } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companies');
const ipoRoutes = require('./routes/ipos');
const documentRoutes = require('./routes/documents');
const adminRoutes = require('./routes/admin');

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_PATH || 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/ipos', ipoRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'IPO Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Database connection and server startup
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');

    // Create default admin user if not exists
    const adminExists = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL || 'admin@ipo-platform.com' }
    });

    if (!adminExists) {
      await User.create({
        email: process.env.ADMIN_EMAIL || 'admin@ipo-platform.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true
      });
      console.log('✅ Default admin user created.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

startServer();