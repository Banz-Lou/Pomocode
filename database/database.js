const Sequelize = require("sequelize");

const db = new Sequelize("pomocode", "", "", {
  dialect: "postgres",
  host: "localhost"
});

/* Connect to DB */
//NOTE: in non-production mode, create database 'pomocode'
db.authenticate()
  .then(() => {
    console.log("Connected to database: pomocode.");
  })
  .catch(err => {
    console.log("Failed to connect to db. Error:", err);
  });

/* DB Schema */
const Users = db.define("users", {
  git_id: { type: Sequelize.STRING, unique: true },
  user_name: Sequelize.STRING,
  true_interval_num: { type: Sequelize.INTEGER, defaultValue: 0 }
});

const Issues_Intervals = db.define("issues_intervals", {
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

const Files_Intervals = db.define("files_intervals", {
  user_name: Sequelize.STRING,
  daily_interval: Sequelize.INTEGER,
  true_interval_num: { type: Sequelize.INTEGER, defaultValue: 0 },
  file_path: Sequelize.STRING,
  status: Sequelize.STRING,
  active: Sequelize.INTEGER,
  idle: Sequelize.INTEGER,
  word_count: Sequelize.INTEGER
});

const Intervals = db.define("intervals", {
  user_name: Sequelize.STRING,
  true_interval_num: { type: Sequelize.INTEGER, defaultValue: 0 },
  daily_interval: Sequelize.INTEGER
});

const Issues = db.define("issues", {
  git_id: { type: Sequelize.STRING, unique: true },
  repo_url: Sequelize.STRING,
  repo_name_with_owner: Sequelize.STRING,
  repo_issue_num: Sequelize.INTEGER,
  title: Sequelize.STRING,
  body: Sequelize.TEXT("long"),
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
Users.hasMany(Issues);
Issues.belongsTo(Users);

Intervals.hasMany(Files_Intervals);
Files_Intervals.belongsTo(Intervals);

Intervals.hasMany(Issues_Intervals);
Issues_Intervals.belongsTo(Intervals);

Issues.hasMany(Issues_Intervals);
Issues_Intervals.belongsTo(Issues);

Issues.hasMany(Files_Intervals);
Files_Intervals.belongsTo(Issues);

/* DB SYNC */
Users.sync();
Issues.sync();
Issues_Intervals.sync();
Files_Intervals.sync();
Intervals.sync();

module.exports = {
  db,
  Users,
  Issues,
  Intervals,
  Issues_Intervals,
  Files_Intervals
};
