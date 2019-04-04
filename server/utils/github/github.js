const axios = require('axios');
const express = require('express');
const router = express.Router();

// authorization check
const { access } = require('../authorize');

// github queries
const { assignedIssues } = require('./queries');

// db connection
const { Users, Issues } = require('../../../database/database');

const gitHubAPI = 'https://api.github.com/graphql';
const APIHeader = { headers: null };

router.get('/github', access, async (req, res) => {
	const { accessToken, user_name } = req.session.passport.user;
	const query = assignedIssues(user_name);
	APIHeader.headers = { Authorization: `bearer ${accessToken}` };

	try {
		const { data } = await axios.post(gitHubAPI, { query }, APIHeader);
		const { nodes } = data.data.search;
		const user = await Users.findOne({ where: { user_name } });

		for (const issue of nodes) {
			await writeIssues(issue);
		}

		async function writeIssues(issue) {
			let issueObj = {
				git_id: issue.id,
				repo_url: issue.repository.url,
				repo_name_with_owner: issue.repository.nameWithOwner,
				repo_issue_num: issue.number,
				title: issue.title,
				body: issue.body,
				user_id: user.id
			};
			await Issues.upsert(issueObj).catch(err => {
				throw err;
			});
		}
		// async op in sequence due to (future) connection limit...
		// will consider parallel when more connnections available

		// 	[ { id: 'MDU6SXNzdWUzNzE4NjI3ODk=',
		//   number: 4,
		//   title: 'Debug analytics chart rendering',
		//   body: '',
		//   repository:
		//    { id: 'MDEwOlJlcG9zaXRvcnkxNTM2NjQ2NTk=',
		//      nameWithOwner: 'fredricklou523/Pomocode-AnalyticsService',
		//      url: 'https://github.com/fredricklou523/Pomocode-AnalyticsService' } },
		// { id: 'MDU6SXNzdWUzNzE4NjIzOTI=',
		//   number: 3,
		//   title: 'Create seed data',
		//   body: 'Create seed data that varies issues, days, and intervals',
		//   repository:
		//    { id: 'MDEwOlJlcG9zaXRvcnkxNTM2NjQ2NTk=',
		//      nameWithOwner: 'fredricklou523/Pomocode-AnalyticsService',
		//      url: 'https://github.com/fredricklou523/Pomocode-AnalyticsService' } }]

		res.send('Fetched assigned open issues.');
	} catch (err) {
		console.log('Error obtaining data. Err:', err);
		res.send('Unable to fetch data.');
	}
});

module.exports = router;

//Issue Data (console node)
// [ { id: 'MDU6SXNzdWUzNzE4NjI3ODk=',
//     number: 4,
//     title: 'Debug analytics chart rendering',
//     body: '',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTM2NjQ2NTk=',
//        nameWithOwner: 'fredricklou523/Pomocode-AnalyticsService',
//        url: 'https://github.com/fredricklou523/Pomocode-AnalyticsService' } },
//   { id: 'MDU6SXNzdWUzNzE4NjIzOTI=',
//     number: 3,
//     title: 'Create seed data',
//     body: 'Create seed data that varies issues, days, and intervals',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTM2NjQ2NTk=',
//        nameWithOwner: 'fredricklou523/Pomocode-AnalyticsService',
//        url: 'https://github.com/fredricklou523/Pomocode-AnalyticsService' } },
//   { id: 'MDU6SXNzdWUzNzE4NjIxOTg=',
//     number: 2,
//     title: 'VScode - Microservice Set Up',
//     body: 'Set up server and DB for VS code microservice and connect to analytics',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTM2NjQ2NTk=',
//        nameWithOwner: 'fredricklou523/Pomocode-AnalyticsService',
//        url: 'https://github.com/fredricklou523/Pomocode-AnalyticsService' } },
//   { id: 'MDU6SXNzdWUzNzE2NDI3OTE=',
//     number: 1,
//     title: 'Historical Data Object',
//     body: 'Create data query and object creation to serve up to the front end for Historical Data Analysis',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTM2NjQ2NTk=',
//        nameWithOwner: 'fredricklou523/Pomocode-AnalyticsService',
//        url: 'https://github.com/fredricklou523/Pomocode-AnalyticsService' } },
//   { id: 'MDU6SXNzdWUzNzAyNjA3MjI=',
//     number: 79,
//     title: 'Interval Updates create endpoints and data manipulation',
//     body: '',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTA3OTcxNTc=',
//        nameWithOwner: 'teamPERSEUS/Pomocode',
//        url: 'https://github.com/teamPERSEUS/Pomocode' } },
//   { id: 'MDU6SXNzdWUzNjk0MTA5NzE=',
//     number: 65,
//     title: 'VSCode Features',
//     body: 'Add the following functionality for the VS Code Extension:\nIdle Time, Active Time, Wordcount',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTA3OTcxNTc=',
//        nameWithOwner: 'teamPERSEUS/Pomocode',
//        url: 'https://github.com/teamPERSEUS/Pomocode' } },
//   { id: 'MDU6SXNzdWUzNjkzMjI1OTA=',
//     number: 63,
//     title: 'Data Structure - Historical Trends',
//     body: 'child of #60',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTA3OTcxNTc=',
//        nameWithOwner: 'teamPERSEUS/Pomocode',
//        url: 'https://github.com/teamPERSEUS/Pomocode' } },
//   { id: 'MDU6SXNzdWUzNjkzMjI0NzM=',
//     number: 62,
//     title: 'Data Structure- Issue/Interval Analysis',
//     body: 'child of #60',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTA3OTcxNTc=',
//        nameWithOwner: 'teamPERSEUS/Pomocode',
//        url: 'https://github.com/teamPERSEUS/Pomocode' } },
//   { id: 'MDU6SXNzdWUzNjkzMjIzMjc=',
//     number: 61,
//     title: 'Data Structure - Interval Updates',
//     body: 'child of #60',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTA3OTcxNTc=',
//        nameWithOwner: 'teamPERSEUS/Pomocode',
//        url: 'https://github.com/teamPERSEUS/Pomocode' } },
//   { id: 'MDU6SXNzdWUzNjkzMjIwMDc=',
//     number: 60,
//     title: 'Analytics Microservice Data Send to Front End',
//     body: 'Understand what data needs to be sent and how the data should be formatted',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTA3OTcxNTc=',
//        nameWithOwner: 'teamPERSEUS/Pomocode',
//        url: 'https://github.com/teamPERSEUS/Pomocode' } },
//   { id: 'MDU6SXNzdWUzNjkzMjE1MDY=',
//     number: 59,
//     title: 'TBD',
//     body: '',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTA3OTcxNTc=',
//        nameWithOwner: 'teamPERSEUS/Pomocode',
//        url: 'https://github.com/teamPERSEUS/Pomocode' } },
//   { id: 'MDU6SXNzdWUzNjkzMTE3Mjc=',
//     number: 47,
//     title: 'Vscode server send to Analytics',
//     body: 'Upon committing data to server, chain send to analytics\n\nchild of #45',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTA3OTcxNTc=',
//        nameWithOwner: 'teamPERSEUS/Pomocode',
//        url: 'https://github.com/teamPERSEUS/Pomocode' } },
//   { id: 'MDU6SXNzdWUzNjkzMDY5ODI=',
//     number: 41,
//     title: 'VScode Extension - Data Capture',
//     body: '',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTA3OTcxNTc=',
//        nameWithOwner: 'teamPERSEUS/Pomocode',
//        url: 'https://github.com/teamPERSEUS/Pomocode' } },
//   { id: 'MDU6SXNzdWUzNjkyODI5NTM=',
//     number: 2,
//     title: 'Data Upload interfering with Timer',
//     body: 'Data Upload function is messing with the reset function',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTE0NjIzNzU=',
//        nameWithOwner: 'teamPERSEUS/PomoCodo-Extension',
//        url: 'https://github.com/teamPERSEUS/PomoCodo-Extension' } },
//   { id: 'MDU6SXNzdWUzNjkyODI0MDQ=',
//     number: 1,
//     title: 'Reset Data Obj on new interval',
//     body: 'Data Object reset is currently creating bugs with the timer',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNTE0NjIzNzU=',
//        nameWithOwner: 'teamPERSEUS/PomoCodo-Extension',
//        url: 'https://github.com/teamPERSEUS/PomoCodo-Extension' } },
//   { id: 'MDU6SXNzdWUzNjIzMjc4NTc=',
//     number: 25,
//     title: 'As a developer, when I merge to the organization master, my application should automatically deploy to the staging server',
//     body: '',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNDk0ODk4NTc=',
//        nameWithOwner: 'sumptingeneric/KidDash',
//        url: 'https://github.com/sumptingeneric/KidDash' } },
//   { id: 'MDU6SXNzdWUzNjE4OTg0Njg=',
//     number: 12,
//     title: 'As a teacher when a post is no longer current I expect to be able to delete it.',
//     body: 'What do we mean by a "current" post? What is current exactly?',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNDk0ODk4NTc=',
//        nameWithOwner: 'sumptingeneric/KidDash',
//        url: 'https://github.com/sumptingeneric/KidDash' } },
//   { id: 'MDU6SXNzdWUzNjE4ODc1Mjc=',
//     number: 8,
//     title: 'As a teacher when I access my account I should be able to view analytics.',
//     body: 'Sub-divide',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNDk0ODk4NTc=',
//        nameWithOwner: 'sumptingeneric/KidDash',
//        url: 'https://github.com/sumptingeneric/KidDash' } },
//   { id: 'MDU6SXNzdWUzNTc3OTE4MTk=',
//     number: 28,
//     title: 'As a developer I need to learn how to implement swiping',
//     body: '',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNDc0MzIxNTA=',
//        nameWithOwner: 'sumptingeneric/barback',
//        url: 'https://github.com/sumptingeneric/barback' } },
//   { id: 'MDU6SXNzdWUzNTc0MjMwMTc=',
//     number: 5,
//     title: 'As a developer, the app should deploy when I commit to the project master branch. Heroku',
//     body: '',
//     repository:
//      { id: 'MDEwOlJlcG9zaXRvcnkxNDc0MzIxNTA=',
//        nameWithOwner: 'sumptingeneric/barback',
//        url: 'https://github.com/sumptingeneric/barback' } } ]
