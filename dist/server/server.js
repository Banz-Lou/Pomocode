'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _router = require('@reach/router');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _App = require('../../src/components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

//  Server-Side

//this allows us the backend to handle client side routing (if we use it)


var html = _fs2.default.readFileSync('dist/index.html').toString();
var parts = html.split('not rendered');

// Authentication and Authorization
var oauth = require('../../server/utils/authenticate');

var _require = require('../../server/utils/authorize'),
    access = _require.access;

// GitHub Data fetch


var gitHub = require('../../server/utils/github/github');

// SQLIZE & DB Connection
var Sequelize = require('sequelize');

var _require2 = require('../../database/database'),
    db = _require2.db,
    Users = _require2.Users,
    Intervals = _require2.Intervals,
    Issues = _require2.Issues,
    IssuesIntervals = _require2.IssuesIntervals,
    FilesIntervals = _require2.FilesIntervals;

if (process.env !== 'production') {
	require('dotenv').config();
}

var app = express();
var PORT = process.env.PORT;


app.use('/dashboard', express.static(path.join(__dirname, '/../index.html')));

app.use(function (req, res) {
	var reactMarkup = _react2.default.createElement(
		_router.ServerLocation,
		{ url: req.url },
		_react2.default.createElement(_App2.default, null)
	);
	res.send('' + parts[0] + (0, _server.renderToString)(reactMarkup) + parts[1]);
	res.end();
});

app.use(session({
	secret: 'PotatoCode',
	resave: false,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/auth', oauth);
app.use('/query', gitHub);

//Initial setup

app.get('/login', function (req, res) {
	res.send('Please Login.');
});

//Post
app.post('/api/vsCode', function (req, res) {
	var userName = req.body.userName;
	var dailyInterval = req.body.interval;
	var data = req.body.data;
	// issues get rewritten as an array of {id: id, title: title}
	var issues = Object.keys(data);
	var trueIntervalNum = void 0,
	    intervalId = void 0;

	// incrementing true interval num; Users is source of truth for trueIntervalNum
	Users.increment('trueIntervalNum', {
		where: { userName: userName }
	}).then(function (results) {
		trueIntervalNum = results[0][0][0].trueIntervalNum;
		var intervalObj = { userName: userName, dailyInterval: dailyInterval, trueIntervalNum: trueIntervalNum };
		return Intervals.create(intervalObj);
	}).then(function (results) {
		// saving interval Id for later use; obtaining issues ids
		intervalId = results.dataValues.id;
		return Issues.findAll({
			where: { title: issues },
			attributes: ['id', 'title']
		});
	}).then(function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(results) {
			var i, entry, issueId, issuesIntervalsObj, filePath, filesIntervalObj, status, info, priorInterval;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							// reassign issues to be of { id, title }
							issues = results.map(function (issue) {
								return { id: issue.id, title: issue.title };
							});
							// query issuesInterval table for the last issue id (based on Created at)

							// for every issue worked on in the interval..
							i = 0;

						case 2:
							if (!(i < issues.length)) {
								_context.next = 18;
								break;
							}

							entry = data[issues[i].title];
							issueId = issues[i].id;
							issuesIntervalsObj = {
								issueId: issueId,
								intervalId: intervalId,
								userName: userName,
								dailyInterval: dailyInterval,
								trueIntervalNum: trueIntervalNum,
								active: 0,
								idle: 0,
								wordCount: 0
							};

							// for every file worked on per issue...

							for (filePath in entry) {
								// filesInterval entry
								filesIntervalObj = {
									issueId: issueId,
									intervalId: intervalId,
									userName: userName,
									dailyInterval: dailyInterval,
									trueIntervalNum: trueIntervalNum,
									filePath: filePath
								};

								// for every status (Running/Break) per file...

								for (status in entry[filePath]) {
									filesIntervalObj.status = status;

									// for all info needed...
									for (info in entry[filePath][status]) {
										filesIntervalObj[info] = entry[filePath][status][info];

										//store interval data
										if (info === 'active') issuesIntervalsObj.active += filesIntervalObj[info];
										if (info === 'idle') issuesIntervalsObj.idle += filesIntervalObj[info];
										if (info === 'wordCount') issuesIntervalsObj.wordCount += filesIntervalObj[info];
									}
									//save FilesInterval HERE
									FilesIntervals.create(filesIntervalObj).catch(function (err) {
										return console.error(err);
									});
								}
							}

							// async await to obtain prior time information
							_context.next = 9;
							return IssuesIntervals.findOne({
								where: { issueId: issueId },
								attributes: ['totalActive', 'totalIdle'],
								order: [['createdAt', 'DESC']]
							}).then(function (results) {
								return results === null ? { priorActive: 0, priorIdle: 0 } : {
									priorActive: results.totalActive,
									priorIdle: results.totalIdle
								};
							});

						case 9:
							priorInterval = _context.sent;


							// sum issue interval information (prior + current)
							issuesIntervalsObj.priorActive = priorInterval.priorActive;
							issuesIntervalsObj.priorIdle = priorInterval.priorIdle;
							issuesIntervalsObj.totalActive = issuesIntervalsObj.active + priorInterval.priorActive;
							issuesIntervalsObj.totalIdle = issuesIntervalsObj.idle + priorInterval.priorIdle;
							// save IssuesInterval HERE
							IssuesIntervals.create(issuesIntervalsObj).catch(function (error) {
								return console.error(error);
							});

						case 15:
							i++;
							_context.next = 2;
							break;

						case 18:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		}));

		return function (_x) {
			return _ref.apply(this, arguments);
		};
	}());
});

app.listen(PORT, function () {
	console.log('Pomocode listening on port ' + PORT);
});