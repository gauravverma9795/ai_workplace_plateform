const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { withAuth } = require('./middleware/clerkAuth');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Route files
const userRoutes = require('./routes/users');
const workspaceRoutes = require('./routes/workspaces');
const teamRoutes = require('./routes/teams');
const contentRoutes = require('./routes/content');
const apiKeyRoutes = require('./routes/apiKeys');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Add Clerk Auth to all requests
app.use(withAuth);

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/api-keys', apiKeyRoutes);

// Error handler middleware
app.use(errorHandler);

module.exports = app;