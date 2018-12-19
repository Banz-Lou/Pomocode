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
const { db, Users } = require('../database/database');
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

	const updateTrueInterval = () => {
		Users.update(
			{ trueIntervalNum: Sequelize.literal('trueIntervalNum + 1') },
			{ where: { userName: userName } }
		).then(results => console.log(results[0]));
	};
	updateTrueInterval();

	const writeInterval = () => {
		let intervalObj = {
			userName,
			interval
		};
	};
});

app.listen(PORT, () => {
	console.log(`Pomocode listening on port ${PORT}`);
});

// { interval: 1,
//   data:
//    { 'VScode - Microservice Set Up':
//       { '/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx':
//          { Running:
//             { time: 6,
//               wordCount: 4,
//               idleTime: 0,
//               git_id: 'MDU6SXNzdWUzNzE4NjIxOTg=' } },
//         '/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/App.jsx':
//          { Running:
//             { time: 10,
//               wordCount: 6,
//               idleTime: 3,
//               git_id: 'MDU6SXNzdWUzNzE4NjIxOTg=' },
//            Break:
//             { time: 0,
//               wordCount: 0,
//               idleTime: 0,
//               git_id: 'MDU6SXNzdWUzNzE4NjIxOTg=' } } } },
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
