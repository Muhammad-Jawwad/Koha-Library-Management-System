const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const kohaApiBaseUrl = 'http://www.eakl.neduet.edu.pk:8000/api/v1/';

// middleware to authenticate requests
const authenticateRequest = async (req, res, next) => {
  try {
    const response = await axios.post(
      `${kohaApiBaseUrl}login`,
      {
        userid: process.env.KOHA_USER_ID,
        password: process.env.KOHA_PASSWORD,
      },
      {
        headers: {
          'X-Client-Id': process.env.KOHA_CLIENT_ID,
          'X-Secret': process.env.KOHA_SECRET,
        },
      }
    );

    req.sessionToken = response.data.sessionToken;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

app.get('/patrons/:id', authenticateRequest, async (req, res) => {
  try {
    const response = await axios.get(
      `${kohaApiBaseUrl}patrons/${req.params.id}`,
      {
        headers: {
          'X-Client-Id': process.env.KOHA_CLIENT_ID,
          'X-Secret': process.env.KOHA_SECRET,
          'X-Session-Token': req.sessionToken
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


// const express = require('express');
// const request = require('request');

// const app = express();

// app.get('/patrons/:id', (req, res) => {
//     const url = `http://www.eakl.neduet.edu.pk:8000/api/v1/patrons/${req.params.id}`;
  
//     const options = {
//       headers: {
//         'Client-ID': '4de0cf19-6b3b-4822-b76a-eb82e9966ae2',
//         'Secret': '5582dd67-9424-4733-b6b3-fd2658ff7e70',
//         'User-ID': 'rizvi4404893@cloud.neduet.edu.pk',
//         'Password': 'bcit-076',
//         'Student-ID': '4404893'
//       } 
//     };
  
//     request.get(url, options, (error, response, body) => {
//         console.log(body);

//       if (error) {
//         return res.status(500).json({
//           error: 'Internal server error'
//         });
//       }
  
//       if (response.statusCode !== 200) {
//         // console.log(body);

//         return res.status(response.statusCode).json({
//           error: 'Failed to retrieve person data'
//         });
//       }
  
//       const data = JSON.parse(body);
//       return res.status(200).json(data);
//     });
// });
  

// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });
