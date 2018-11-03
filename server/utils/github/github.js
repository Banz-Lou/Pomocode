const axios = require('axios');
const express = require('express');
const router = express.Router();

// authorization check
const { access } = require('../authorize');

// github queries
const { assignedIssues } = require('./queries');

const gitHubAPI = 'https://api.github.com/graphql';
const APIHeader = { headers: null };

router.get('/github', access, (req, res) => {
  const { accessToken, username } = req.session.passport.user;
  const query = assignedIssues(username);
  APIHeader.headers = { Authorization: `bearer ${accessToken}` };

  axios.post(gitHubAPI, { query }, APIHeader)
    .then(({ data }) => {
      res.send(data.data);
    })
    .catch(err => {
      res.send("Unable to fetch data.");
    });
});

module.exports = router;