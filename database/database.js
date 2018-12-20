const Sequelize = require('sequelize');

const db = new Sequelize('pomocode', '', '', {
	dialect: 'postgres',
	host: 'localhost'
});

/* Connect to DB */
//NOTE: in non-production mode, create database 'pomocode'
db.authenticate()
	.then(() => {
		console.log('Connected to database: pomocode.');
	})
	.catch(err => {
		console.log('Failed to connect to db. Error:', err);
	});

/* DB Schema */
const Users = db.define('users', {
	gitId: { type: Sequelize.STRING, unique: true },
	userName: Sequelize.STRING,
	trueIntervalNum: { type: Sequelize.INTEGER, defaultValue: 0 }
});

const IssuesIntervals = db.define('issues_intervals', {
	userName: Sequelize.STRING,
	dailyInterval: Sequelize.INTEGER,
	trueIntervalNum: { type: Sequelize.INTEGER, defaultValue: 0 },
	priorActive: Sequelize.INTEGER,
	active: Sequelize.INTEGER,
	totalActive: Sequelize.INTEGER,
	priorIdle: Sequelize.INTEGER,
	idle: Sequelize.INTEGER,
	totalIdle: Sequelize.INTEGER,
	wordCount: Sequelize.INTEGER
});

const FilesIntervals = db.define('files_intervals', {
	userName: Sequelize.STRING,
	dailyInterval: Sequelize.INTEGER,
	trueIntervalNum: { type: Sequelize.INTEGER, defaultValue: 0 },
	filePath: Sequelize.STRING,
	status: Sequelize.STRING,
	active: Sequelize.INTEGER,
	idle: Sequelize.INTEGER,
	wordCount: Sequelize.INTEGER
});

const Intervals = db.define('intervals', {
	userName: Sequelize.STRING,
	trueIntervalNum: { type: Sequelize.INTEGER, defaultValue: 0 },
	interval: Sequelize.INTEGER
});

const Issues = db.define('issues', {
	gitId: { type: Sequelize.STRING, unique: true },
	repoURL: Sequelize.STRING,
	repoNameWithOwner: Sequelize.STRING,
	repoIssueNum: Sequelize.INTEGER,
	title: Sequelize.STRING,
	body: Sequelize.TEXT('long'),
	planSeconds: { type: Sequelize.INTEGER, defaultValue: null },
	planStartDate: { type: Sequelize.DATEONLY, defaultValue: null },
	planEndDate: { type: Sequelize.DATEONLY, defaultValue: null },
	completeTime: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	variance: { type: Sequelize.FLOAT, defaultValue: null }
});

/* FOREIGN KEYS */
Users.hasMany(Issues);
Issues.belongsTo(Users);

Intervals.hasMany(FilesIntervals);
FilesIntervals.belongsTo(Intervals);

Intervals.hasMany(IssuesIntervals);
IssuesIntervals.belongsTo(Intervals);

Issues.hasMany(IssuesIntervals);
IssuesIntervals.belongsTo(Issues);

Issues.hasMany(FilesIntervals);
FilesIntervals.belongsTo(Issues);

/* DB SYNC */
Users.sync();
Issues.sync();
IssuesIntervals.sync();
FilesIntervals.sync();
Intervals.sync();

module.exports = {
	db,
	Users,
	Issues,
	Intervals
};
