const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

// Import routes
const authRoutes = require('../routes/auth');
const artistRoutes = require('../routes/artist');
const favoritesRoutes = require('../routes/favorites');
const genesRoutes = require('../routes/genes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://art-explorer-web.netlify.app',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/.netlify/functions/api/auth', authRoutes);
app.use('/.netlify/functions/api/artists', artistRoutes);
app.use('/.netlify/functions/api/favorites', favoritesRoutes);
app.use('/.netlify/functions/api/genes', genesRoutes);

// Health check endpoint
app.get('/.netlify/functions/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export the serverless function
module.exports.handler = serverless(app); 