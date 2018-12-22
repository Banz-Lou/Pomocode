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
const {
	db,
	Users,
	Intervals,
	Issues,
	IssuesIntervals,
	FilesIntervals
} = require('../database/database');
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
		.then(async results => {
			// reassign issues to be of { id, title }
			issues = results.map(issue => ({ id: issue.id, title: issue.title }));
			// query issuesInterval table for the last issue id (based on Created at)

			for (let i = 0; i < issues.length; i++) {
				let entry = data[issues[i].title];
				let issueId = issues[i].id;
				// issuesInterval entry
				let issuesIntervalsObj = {
					issueId,
					intervalId,
					userName,
					dailyInterval,
					trueIntervalNum,
					active: 0,
					idle: 0,
					wordCount: 0
				};

				for (let filePath in entry) {
					// filesInterval entry
					let filesIntervalObj = {
						issueId,
						intervalId,
						userName,
						dailyInterval,
						trueIntervalNum,
						filePath
					};

					for (let status in entry[filePath]) {
						filesIntervalObj.status = status;

						for (let info in entry[filePath][status]) {
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
						FilesIntervals.create(filesIntervalObj).catch(err =>
							console.error(err)
						);
					}
				}

				// async await to obtain prior time information
				let priorInterval = await IssuesIntervals.findOne({
					where: { issueId },
					attributes: ['totalActive', 'totalIdle'],
					order: [['createdAt', 'DESC']]
				}).then(results => {
					return results === null
						? { priorActive: 0, priorIdle: 0 }
						: {
								priorActive: results.totalActive,
								priorIdle: results.totalIdle
						  };
				});

				issuesIntervalsObj.priorActive = priorInterval.priorActive;
				issuesIntervalsObj.priorIdle = priorInterval.priorIdle;
				issuesIntervalsObj.totalActive =
					issuesIntervalsObj.active + priorInterval.priorActive;
				issuesIntervalsObj.totalIdle =
					issuesIntervalsObj.idle + priorInterval.priorIdle;
				// save IssuesInterval HERE
				IssuesIntervals.create(issuesIntervalsObj).catch(error =>
					console.error(error)
				);
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
