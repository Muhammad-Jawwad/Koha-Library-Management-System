const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const base64 = require('base-64');

// Set up middleware to parse JSON request bodies
app.use(bodyParser.json());

// Route to retrieve access token from Koha REST API
app.post('/api/auth/token', (req, res) => {
  const domain = 'http://www.eakl.neduet.edu.pk:8000';
  const username = '4404893';
  const password = '4404893';
  const apiKey = 'm5582dd67-9424-4733-b6b3-fd2658ff7e70';
  const clientId = '4de0cf19-6b3b-4822-b76a-eb82e9966ae2';
  const url = `${domain}/api/v1/auth/token`;

  const authHeaderValue = base64.encode(`${username}:${password}`);
  const headers = {
    'Authorization': `Basic ${authHeaderValue}`,
    'X-API-Key': apiKey
  };

  request.post({
    url: url,
    headers: headers
  }, (error, response, body) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        message: 'An error occurred while retrieving the access token from the Koha REST API'
      });
    }
    if (response.statusCode === 200) {
      const accessToken = body;
      return res.status(200).json({
        accessToken: accessToken
      });
    } else {
      return res.status(response.statusCode).json({
        message: `An error occurred while retrieving the access token from the Koha REST API: ${response.statusCode} ${response.statusMessage}`
      });
    }
  });
});

// Start the Express.js app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});