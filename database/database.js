const Sequelize = require('sequelize');
const db = new Sequelize('pomocode', 'root', '', {
	dialect: 'mysql',
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
	gitID: {
		type: Sequelize.STRING,
		unique: true
	},
	username: Sequelize.STRING
});

// maybe has user id relation
const Repositories = db.define('repositories', {
	gitID: {
		type: Sequelize.STRING,
		unique: true
	},
	url: Sequelize.STRING,
	nameWithOwner: Sequelize.STRING
});

// has user id relation, repo id relation
const Issues = db.define('issues', {
	gitID: {
		type: Sequelize.STRING,
		unique: true
	},
	number: Sequelize.INTEGER,
	title: Sequelize.STRING,
	body: Sequelize.TEXT('long')
});

// has issue id relation, repo id relation, user id relation
// const Plans = db.define('plans', {

// });

// establishing one-to-many relationships
Users.hasMany(Repositories);
Users.hasMany(Issues);
Repositories.hasMany(Issues);

// promise chaining to account for relationships
Users.sync()
	.then(async () => await Repositories.sync())
	.then(async () => await Issues.sync());

module.exports.db = db;
module.exports.Users = Users;
module.exports.Repositories = Repositories;
module.exports.Issues = Issues;
