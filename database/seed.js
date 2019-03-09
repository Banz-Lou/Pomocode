const Axios = require('axios');

var dataObj = {
	interval: 1,
	data: {
		'VScode - Microservice Set Up': {
			'/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/App.jsx': {
				Running: {
					active: 5,
					wordCount: 9,
					idle: 0,
					git_id: 'MDU6SXNzdWUzNzE4NjIxOTg='
				}
			},
			'/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx': {
				Running: {
					active: 9,
					wordCount: 7,
					idle: 3,
					git_id: 'MDU6SXNzdWUzNzE4NjIxOTg='
				},
				Break: {
					active: 0,
					wordCount: 0,
					idle: 0,
					git_id: 'MDU6SXNzdWUzNzE4NjIxOTg='
				}
			}
		},
		'VScode Extension - Data Capture': {
			'/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/App.jsx': {
				Running: {
					active: 10,
					wordCount: 50,
					idle: 0,
					git_id: 'MDU6SXNzdWUzNjkzMDY5ODI='
				}
			},
			'/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx': {
				Running: {
					active: 20,
					wordCount: 27,
					idle: 30,
					git_id: 'MDU6SXNzdWUzNjkzMDY5ODI='
				},
				Break: {
					active: 5,
					wordCount: 0,
					idle: 5,
					git_id: 'MDU6SXNzdWUzNjkzMDY5ODI='
				}
			}
		}
	},
	userName: 'fredricklou523',
	gitRepoUrl: 'https://github.com/teamPERSEUS/PomoCodo-Extension',
	idle: 4
};

var files = [
	'/Users/fredricklou/HackReactor/HR33/Thesis/Pomocode/src/presentational/HistoricalTrends/HistoricalTrendsView.jsx',
	'/Users/fredricklou/HackReactor/HR33/Thesis/Pomocode/src/presentational/HistoricalTrends/App.jsx.jsx',
	'/Users/fredricklou/HackReactor/HR33/Thesis/Pomocode/src/presentational/HistoricalTrends/Server.js',
	'/Users/fredricklou/HackReactor/HR33/Thesis/Pomocode/src/presentational/HistoricalTrends/Server.js',
	'/Users/fredricklou/HackReactor/HR33/Thesis/Pomocode/src/presentational/HistoricalTrends/Charts.jsx'
];

var intervals = [];
//create a set of intervals for a day
for (var d = 23; d < 24; d++) {
	for (var i = 1; i < 4; i++) {
		var day = d < 10 ? '0' + d : d;
		var newDate = new Date(
			day + ' October 2018 14:4' + i + ' UTC'
		).toISOString();
		let interval = [];
		debugRun.time = Math.floor(Math.random() * 1500);
		debugRun.idleTime = Math.floor(Math.random() * 300);
		debugBreak.time = Math.floor(Math.random() * 100);
		debugBreak.idleTime = Math.floor(Math.random() * 300);
		debugRun.fileName = files[Math.floor(Math.random() * 4)];
		debugBreak.fileName = files[Math.floor(Math.random() * 4)];
		debugRun.wordCount = Math.floor(Math.random() * 300);
		debugBreak.wordCount = Math.floor(Math.random() * 50);
		debugRun.intervalNum = i;
		debugBreak.intervalNum = i;
		debugRun.date = newDate;
		debugBreak.date = newDate;
		let newRun = Object.assign({}, debugRun);
		let newBreak = Object.assign({}, debugBreak);
		interval.push(newRun);
		interval.push(newBreak);
		intervals.push(interval);
	}
}
