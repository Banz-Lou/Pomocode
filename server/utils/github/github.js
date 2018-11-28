const axios = require('axios');
const express = require('express');
const router = express.Router();

// authorization check
const { access } = require('../authorize');

// github queries
const { assignedIssues } = require('./queries');

// db connection
const { Users, Repositories, Issues } = require('../../../database/database');

const gitHubAPI = 'https://api.github.com/graphql';
const APIHeader = { headers: null };

router.get('/github', access, async (req, res) => {
  const { accessToken, username } = req.session.passport.user;
  const query = assignedIssues(username);
  APIHeader.headers = { Authorization: `bearer ${accessToken}` };

  try {
    const { data } = await axios.post(gitHubAPI, { query }, APIHeader);
    const { nodes } = data.data.search;
    const user = await Users.findOne({ where: { username } });

    // async op in sequence due to (future) connection limit...
    // will consider parallel when more connnections available
    for (const issue of nodes) {
      await Repositories.upsert({
        gitID: issue.repository.id,
        url: issue.repository.url,
        nameWithOwner: issue.repository.nameWithOwner,
        userId: user.dataValues.id
      });
      const repo = await Repositories.findOne({
        where: { gitID: issue.repository.id }
      });
      await Issues.upsert({
        gitID: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        userId: user.dataValues.id,
        repositoryId: repo.dataValues.id
      });
    }
    res.send("Fetched assigned open issues.");
  }
  catch (err) {
    console.log("Error obtaining data. Err:", err);
    res.send("Unable to fetch data.");
  }
});

module.exports = router;