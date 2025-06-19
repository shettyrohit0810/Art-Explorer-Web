const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getXAppToken } = require('../services/artsyService');

router.get('/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    const token = await getXAppToken();
    
    const response = await axios.get(`https://api.artsy.net/api/search`, {
      headers: { 'X-XAPP-Token': token },
      params: { q: query, size: 10, type: 'artist' }
    });

    const artists = response.data._embedded.results
      .filter(item => item.type === 'artist')
      .map(artist => ({
        id: artist._links.self.href.split('/').pop(),
        name: artist.title,
        image: artist._links.thumbnail?.href.includes('missing_image.png')
          ? '/assets/artsy_logo.svg'
          : artist._links.thumbnail?.href
      }));

    res.json(artists);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

router.get('/:id', async (req, res) => {
  const artistId = req.params.id;

  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID' });
  }

  try {
    const token = await getXAppToken();

    const response = await axios.get(`https://api.artsy.net/api/artists/${artistId}`, {
      headers: { 'X-XAPP-Token': token }
    });

    const data = response.data;

    const artistDetails = {
      id: data.id,
      name: data.name,
      nationality: data.nationality || 'Unknown',
      years: (data.birthday || data.deathday)
        ? `${data.birthday || 'Unknown'} – ${data.deathday || 'Unknown'}`
        : 'Unknown',
      biography: (data.biography)
        .replace(/-\s+/g, '')
        .replace(/[\uFFFD\u2013\u2014\u2012\u2011\u2010\u0096\u0097\x96]/g, '-'),
      image: data._links.thumbnail?.href.includes('missing_image.png')
        ? '/assets/artsy_logo.svg'
        : data._links.thumbnail?.href
    };

    res.json(artistDetails);
  } catch (err) {
    console.error(`Error fetching artist details: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch artist details' });
  }
});

router.get('/:id/artworks', async (req, res) => {
  const artistId = req.params.id;

  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID' });
  }

  try {
    const token = await getXAppToken();

    const response = await axios.get('https://api.artsy.net/api/artworks', {
      headers: { 'X-XAPP-Token': token },
      params: { artist_id: artistId, size: 10 }
    });

    const artworks = response.data._embedded.artworks.map(artwork => ({
      id: artwork.id,
      title: artwork.title || 'Untitled',
      date: artwork.date || 'Unknown',
      image: artwork._links.thumbnail?.href.includes('missing_image.png')
        ? '/assets/artsy_logo.svg'
        : artwork._links.thumbnail?.href
    }));

    res.json(artworks);
  } catch (err) {
    console.error(`Error fetching artworks for artist ${artistId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch artist artworks' });
  }
});

router.get('/:id/similar', async (req, res) => {
  const artistId = req.params.id;

  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID' });
  }

  try {
    const token = await getXAppToken();

    const response = await axios.get('https://api.artsy.net/api/artists', {
      headers: { 'X-XAPP-Token': token },
      params: { similar_to_artist_id: artistId, size: 5 }
    });

    const similarArtists = response.data._embedded.artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      image: artist._links.thumbnail?.href.includes('missing_image.png')
        ? '/assets/artsy_logo.svg'
        : artist._links.thumbnail?.href
    }));

    res.json(similarArtists);
  } catch (err) {
    console.error(`Error fetching similar artists for ${artistId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch similar artists' });
  }
});

module.exports = router;
