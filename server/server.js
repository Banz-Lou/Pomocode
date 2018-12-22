const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

// Authentication and Authorization
const oauth = require('./utils/authenticate');
const { access } = require('./utils/authorize');

// GitHub Data fetch
const gitHub = require('./utils/github/github');

// SQLIZE & DB Connection
const Sequelize = require('sequelize');
const { db, Users, Intervals, Issues } = require('../database/database');
if (process.env !== 'production') {
	require('dotenv').config();
}

const app = express();
const { PORT } = process.env;

app.use(
	session({
		secret: 'PotatoCode',
		resave: false,
		saveUninitialized: true
	})
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/auth', oauth);
app.use('/query', gitHub);

//Initial setup
app.get('/', access, (req, res) => {
	res.send('Hello World!');
});

app.get('/login', (req, res) => {
	res.send('Please Login.');
});

//Post
app.post('/api/vsCode', (req, res) => {
	const userName = req.body.userName;
	const dailyInterval = req.body.interval;
	const data = req.body.data;
	//initially taking object keys from raw data -> data will be reassigned after Issues query to capture Issue ID from DB
	let issues = Object.keys(data);
	let trueIntervalNum, intervalId;

	Users.increment('trueIntervalNum', {
		where: { userName: userName }
	})
		.then(results => {
			trueIntervalNum = results[0][0][0].trueIntervalNum;
			let intervalObj = { userName, dailyInterval, trueIntervalNum };
			return Intervals.create(intervalObj);
		})
		.then(results => {
			intervalId = results.dataValues.id;
			return Issues.findAll({
				where: { title: issues },
				attributes: ['id', 'title']
			});
			//write File Intervals.catch(err);
			//return query Issues (for IssuesId).then
		})
		.then(results => {
			// reassign issues to be of { id, title }
			issues = results.map(issue => ({ id: issue.id, title: issue.title }));
			// query issuesInterval table for the last issue id (based on Created at)

			for (var i = 0; i < issues.length; i++) {
				var entry = data[issues[i].title];

				// issuesInterval entry
				var issuesIntervalsObj = {
					issueId: issues[i].id,
					intervalId,
					userName,
					dailyInterval,
					trueIntervalNum,
					active: 0,
					idle: 0,
					wordCount: 0
				};

				for (var filePath in entry) {
					// filesInterval entry
					var filesIntervalObj = {
						issueId: issues[i].id,
						intervalId,
						userName,
						dailyInterval,
						trueIntervalNum,
						filePath
					};

					for (var status in entry[filePath]) {
						filesIntervalObj.status = status;

						for (var info in entry[filePath][status]) {
							filesIntervalObj[info] = entry[filePath][status][info];

							//store interval data
							if (info === 'active')
								issuesIntervalsObj.active += filesIntervalObj[info];
							if (info === 'idle')
								issuesIntervalsObj.idle += filesIntervalObj[info];
							if (info === 'wordCount')
								issuesIntervalsObj.wordCount += filesIntervalObj[info];
						}
						//save FilesInterval HERE
						//console.table(filesIntervalObj);
					}
				}

				// async await issue intervals info (example data below..)
				var priorActive = (issuesIntervalsObj.priorActive = 25);
				var priorIdle = (issuesIntervalsObj.priorIdle = 25);

				issuesIntervalsObj.totalActive =
					issuesIntervalsObj.active + priorActive;
				issuesIntervalsObj.totalIdle = issuesIntervalsObj.idle + priorIdle;
				// save IssuesInterval HERE
				console.log(issuesIntervalsObj);
			}
		});
});

app.listen(PORT, () => {
	console.log(`Pomocode listening on port ${PORT}`);
});

// { interval: 1,
// data:
//  { 'VScode - Microservice Set Up':
//     { '/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx':
//        { Running:
//           { time: 6,
//             wordCount: 4,
//             idleTime: 0,
//             git_id: 'MDU6SXNzdWUzNzE4NjIxOTg=' } },
//       '/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/App.jsx':
//        { Running:
//           { time: 10,
//             wordCount: 6,
//             idleTime: 3,
//             git_id: 'MDU6SXNzdWUzNzE4NjIxOTg=' },
//          Break:
//           { time: 0,
//             wordCount: 0,
//             idleTime: 0,
//             git_id: 'MDU6SXNzdWUzNzE4NjIxOTg=' } } } },
//   userName: 'fredricklou523',
//   gitRepoUrl: 'https://github.com/teamPERSEUS/PomoCodo-Extension',
// 	idleTime: 4 }

// { "VScode - Microservice Set Up":
//    { "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/App.jsx":
//       { "Running":
//          { "time": 5,
//            "wordCount": 9,
//            "idleTime": 0,
//            "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" } },
//      "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx":
//       { "Running":
//          { "time": 9,
//            "wordCount": 7,
//            "idleTime": 3,
//            "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" },
//         "Break":
//          { "time": 0,
//            "wordCount": 0,
//            "idleTime": 0,
//            "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" } } } }
