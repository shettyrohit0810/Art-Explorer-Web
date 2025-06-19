require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artist');
const favoritesRoutes = require('./routes/favorites');
const genesRoutes = require('./routes/genes');

app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/genes', genesRoutes);

app.use(express.static(path.join(__dirname, 'frontend/dist/frontend/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/frontend/browser/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
