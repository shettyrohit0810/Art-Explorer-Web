const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const artworkId = req.query.artwork_id;
  if (!artworkId) {
    return res.status(400).json({ message: 'Missing artwork_id parameter' });
  }

  try {
    const tokenResponse = await axios.post('https://api.artsy.net/api/tokens/xapp_token', {
      client_id: process.env.ARTSY_CLIENT_ID,
      client_secret: process.env.ARTSY_CLIENT_SECRET
    });
    const token = tokenResponse.data.token;

    const genesResponse = await axios.get('https://api.artsy.net/api/genes', {
      params: { artwork_id: artworkId, size: 5 },
      headers: { 'X-Xapp-Token': token }
    });

    res.json(genesResponse.data);
  } catch (err) {
    console.error('Error fetching genes:', err);
    res.status(500).json({ message: 'Error fetching genes', error: err.message });
  }
});

module.exports = router;
