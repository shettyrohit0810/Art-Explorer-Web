const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/user');
const { getXAppToken } = require('../services/artsyService');

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

router.get('/add', authenticate, async (req, res) => {
  try {
    const artistId = req.query.artistId;
    if (!artistId) return res.status(400).json({ message: 'Artist ID is required' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const normalizedId = artistId.trim().toLowerCase();
    if (user.favorites.some(fav => fav.artistId.toLowerCase() === normalizedId)) {
      return res.status(400).json({ message: 'Artist already in favorites' });
    }

    user.favorites.push({ artistId, addedAt: new Date() });
    await user.save();

    res.status(200).json({ message: 'Artist added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/remove', authenticate, async (req, res) => {
  try {
    const artistId = req.query.artistId;
    if (!artistId) return res.status(400).json({ message: 'Artist ID is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter(fav => fav.artistId !== artistId);
    await user.save();

    res.status(200).json({ message: 'Artist removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = await getXAppToken();

    const enrichedFavorites = await Promise.all(
      user.favorites.map(async fav => {
        try {
          const artistRes = await axios.get(`https://api.artsy.net/api/artists/${fav.artistId}`, {
            headers: { 'X-XAPP-Token': token }
          });
          const artist = artistRes.data;
          return {
            artistId: fav.artistId,
            name: artist.name,
            nationality: artist.nationality || 'Unknown',
            years: (artist.birthday || artist.deathday)
              ? `${artist.birthday || 'Unknown'} – ${artist.deathday || 'Unknown'}`
              : 'Unknown',
            addedAt: fav.addedAt,
            thumbnail: artist._links?.thumbnail?.href.includes('missing_image.png')
              ? 'assets/artsy_logo.svg'
              : artist._links?.thumbnail?.href
          };
        } catch (err) {
          console.error(`Failed to enrich artist ${fav.artistId}:`, err.message);
          return null;
        }
      })
    );

    const filtered = enrichedFavorites.filter(entry => entry !== null);
    const sortedFavorites = filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    res.status(200).json({ favorites: sortedFavorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
