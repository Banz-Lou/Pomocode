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
const users = db.define('users', {
	git_id: { type: Sequelize.STRING, unique: true },
	user_name: Sequelize.STRING,
	true_interval_num: { type: Sequelize.INTEGER, defaultValue: 0 }
});

const issues_intervals = db.define('issues_intervals', {
	user_name: Sequelize.STRING,
	daily_interval: Sequelize.INTEGER,
	true_interval_num: { type: Sequelize.INTEGER, defaultValue: 0 },
	prior_active: Sequelize.INTEGER,
	active: Sequelize.INTEGER,
	total_active: Sequelize.INTEGER,
	prior_idle: Sequelize.INTEGER,
	idle: Sequelize.INTEGER,
	total_idle: Sequelize.INTEGER,
	word_count: Sequelize.INTEGER
});

const files_intervals = db.define('files_intervals', {
	user_name: Sequelize.STRING,
	daily_interval: Sequelize.INTEGER,
	true_interval_num: { type: Sequelize.INTEGER, defaultValue: 0 },
	file_path: Sequelize.STRING,
	status: Sequelize.STRING,
	active: Sequelize.INTEGER,
	idle: Sequelize.INTEGER,
	word_count: Sequelize.INTEGER
});

const intervals = db.define('intervals', {
	user_name: Sequelize.STRING,
	true_interval_num: { type: Sequelize.INTEGER, defaultValue: 0 },
	daily_interval: Sequelize.INTEGER
});

const issues = db.define('issues', {
	git_id: { type: Sequelize.STRING, unique: true },
	repo_url: Sequelize.STRING,
	repo_name_with_owner: Sequelize.STRING,
	repo_issue_num: Sequelize.INTEGER,
	title: Sequelize.STRING,
	body: Sequelize.TEXT('long'),
	plan_seconds: { type: Sequelize.INTEGER, defaultValue: null },
	plan_start_date: { type: Sequelize.DATEONLY, defaultValue: null },
	plan_end_date: { type: Sequelize.DATEONLY, defaultValue: null },
	complete_time: {
		type: Sequelize.INTEGER,
		default_value: 0
	},
	variance: { type: Sequelize.FLOAT, defaultValue: null }
});

/* FOREIGN KEYS */
users.hasMany(issues);
issues.belongsTo(users);

intervals.hasMany(files_intervals);
files_intervals.belongsTo(intervals);

intervals.hasMany(issues_intervals);
issues_intervals.belongsTo(intervals);

issues.hasMany(issues_intervals);
issues_intervals.belongsTo(issues);

issues.hasMany(files_intervals);
files_intervals.belongsTo(issues);

/* DB SYNC */
users.sync();
issues.sync();
issues_intervals.sync();
files_intervals.sync();
intervals.sync();

module.exports = {
	db,
	users,
	issues,
	intervals,
	issues_intervals,
	files_intervals
};
