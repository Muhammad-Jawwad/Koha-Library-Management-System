const express = require('express');
const app = express();
const request = require('request');
const btoa = require('btoa');

const domain = 'http://eakl.neduet.edu.pk:8000';
const username = '4404893';
const password = '4404893';
const apiKey = '4de0cf19-6b3b-4822-b76a-eb82e9966ae2';
const secret = '5582dd67-9424-4733-b6b3-fd2658ff7e70';
const grantType = 'client_credentials';

app.post('/token', (req, res) => {
  const url = `${domain}/api/v1/oauth/token`;
  const authHeaderValue = `Basic ${btoa(`${apiKey}:${secret}`)}`;

  const options = {
    url,
    headers: {
      Authorization: authHeaderValue,
    },
    form: {
      client_id: apiKey,
      grant_type: grantType,
    },
  };

  request.post(options, (error, response, body) => {
    if (error) {
      res.status(500).send(`Error: ${error}`);
    } else if (response.statusCode !== 200) {
      res.status(500).send(`Error: ${response.statusCode}`);
    } else {
      const accessToken = JSON.parse(body).access_token;
      console.log(`Access token: ${accessToken}`);
      res.send(`Access token: ${accessToken}`);
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

