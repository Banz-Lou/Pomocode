const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

//  Server-Side
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
//this allows us the backend to handle client side routing (if we use it)
// import { ServerLocation } from '@reach/router';
import fs from 'fs';
import App from '../src/components/App';

const html = fs.readFileSync('dist/index.html').toString();
const parts = html.split('not rendered');

// Authentication and Authorization
const oauth = require('../server/utils/authenticate');
const { access } = require('../server/utils/authorize');

// GitHub Data fetch
const gitHub = require('../server/utils/github/github');

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
const FRED = 'FRED';
const MIKE = 'MIKE';
// app.use(express.static(path.join(__dirname, '/../index.html')));

app.get('/', (req, res) => {
	res.write(parts[0]);
	const reactMarkup = <App />;
	const stream = renderToNodeStream(reactMarkup);
	stream.pipe(
		res,
		{ end: false }
	);
	stream.on('end', () => {
		res.write(parts[1]);
		res.end();
	});
});

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

app.get('/login', (req, res) => {
	res.send('Please Login.');
});

// GET the last 3 interval updates
app.get('/api/intervalUpdates', (req, res) => {
	// const userName = req.query.userName
	//REMOVE THIS FOR PROD
	const userName = 'fredricklou523';
	Intervals.max('trueIntervalNum', { where: { userName } })
		.then(max => {
			//Defines number of intervals we want to pull
			let oldestInterval = max - 3;
			return IssuesIntervals.findAll({
				where: {
					userName,
					trueIntervalNum: { [Sequelize.Op.gt]: oldestInterval }
				}
			});
		})
		.then(records => {
			res.send(records);
		});
});

//Post
app.post('/api/vsCode', (req, res) => {
	const userName = req.body.userName;
	const dailyInterval = req.body.interval;
	const data = req.body.data;
	console.log('SOME LARGE STRING BIG AND LONG');
	// issues get rewritten as an array of {id: id, title: title}
	let issues = Object.keys(data);
	let trueIntervalNum, intervalId;

	// incrementing true interval num; Users is source of truth for trueIntervalNum
	Users.increment('trueIntervalNum', {
		where: { userName: userName }
	})
		.then(results => {
			trueIntervalNum = results[0][0][0].trueIntervalNum;
			let intervalObj = { userName, dailyInterval, trueIntervalNum };
			return Intervals.create(intervalObj);
		})
		.then(results => {
			// saving interval Id for later use; obtaining issues ids
			intervalId = results.dataValues.id;
			return Issues.findAll({
				where: { title: issues },
				attributes: ['id', 'title']
			});
		})
		.then(async results => {
			// reassign issues to be of { id, title }
			issues = results.map(issue => ({ id: issue.id, title: issue.title }));
			// query issuesInterval table for the last issue id (based on Created at)

			// for every issue worked on in the interval..
			for (let i = 0; i < issues.length; i++) {
				let entry = data[issues[i].title];
				let issueId = issues[i].id;
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

				// for every file worked on per issue...
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

					// for every status (Running/Break) per file...
					for (let status in entry[filePath]) {
						filesIntervalObj.status = status;

						// for all info needed...
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

				// sum issue interval information (prior + current)
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
