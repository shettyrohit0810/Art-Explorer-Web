//services\artsyService.js

const axios = require('axios');

let cachedToken = null;
let tokenExpiry = null;

async function getXAppToken() {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post('https://api.artsy.net/api/tokens/xapp_token', {
    client_id: process.env.ARTSY_CLIENT_ID,
    client_secret: process.env.ARTSY_CLIENT_SECRET
  });

  cachedToken = response.data.token;
  tokenExpiry = new Date(response.data.expires_at).getTime();

  return cachedToken;
}

module.exports = { getXAppToken };
