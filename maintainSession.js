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

let accessToken = '';

// Get the access token on app start
const getToken = () => {
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
      console.error(`Error getting access token: ${error}`);
    } else if (response.statusCode !== 200) {
      console.error(`Error getting access token: ${response.statusCode}`);
    } else {
      accessToken = JSON.parse(body).access_token;
      console.log(`Access token: ${accessToken}`);
    }
  });
};

// Call getToken on app start
getToken();

app.get('/my-protected-page', (req, res) => {
  // Check if we have an access token
  if (accessToken) {
    // Set the Authorization header using the access token
    const authHeaderValue = `Bearer ${accessToken}`;

    // Make a request to the desired page with the Authorization header set
    const options = {
      url: `${domain}/cgi-bin/koha/opac-memberentry.pl`,
      headers: {
        Authorization: authHeaderValue,
      },
    };

    request.get(options, (error, response, body) => {
      if (error) {
        res.status(500).send(`Error: ${error}`);
      } else if (response.statusCode !== 200) {
        res.status(500).send(`Error: ${response.statusCode}`);
      } else {
        // If the request was successful, return the body of the response
        res.send(body);
      }
    });
  } else {
    // If we don't have an access token, return an error message
    res.status(500).send('Error: Access token not found');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
