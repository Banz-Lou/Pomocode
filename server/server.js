const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

// Authentication and Authorization
const oauth = require("../server/utils/authenticate");
const { access } = require("../server/utils/authorize");

// GitHub Data fetch
const gitHub = require("../server/utils/github/github");

// api helper functions
const intUpdFunct = require("../server/utils/APIfunctions/intervalUpdates");

// SQLIZE & DB Connection
const Sequelize = require("sequelize");
const {
  db,
  Users,
  Intervals,
  Issues,
  Issues_Intervals,
  Files_Intervals
} = require("../database/database");
if (process.env !== "production") {
  require("dotenv").config();
}

const app = express();
const { PORT } = process.env;
const FRED = "FRED";
const MIKE = "MIKE";

app.use(express.static(path.join(__dirname, "/../dist")));

app.use(
  session({
    secret: "PotatoCode",
    resave: false,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/auth", oauth);
app.use("/query", gitHub);

//Initial setup
app.get("/login", (req, res) => {
  res.send("Please Login.");
});

// GET the last 3 interval updates
app.get("/api/intervalUpdates", (req, res) => {
  const user_name = req.query.userName;
  //REMOVE THIS FOR PROD
  // const user_name = 'fredricklou523';
  Intervals.max("true_interval_num", {
    where: { user_name }
  })
    .then(max => {
      //Defines number of intervals we want to pull
      var oldestInterval = max - 3;
      return Issues_Intervals.findAll({
        include: [{ model: Issues, attributes: ["plan_seconds", "title"] }],
        where: {
          user_name,
          true_interval_num: { [Sequelize.Op.gt]: oldestInterval }
        }
      });
    })
    .then(records => {
      res.send(intUpdFunct.powerUp(records));
    });
});

//Post
app.post("/api/vsCode", (req, res) => {
  const user_name = req.body.userName;
  const daily_interval = req.body.interval;
  const data = req.body.data;
  console.log("SOME LARGE STRING BIG AND LONG");
  // issues get rewritten as an array of {id: id, title: title}
  let issuesList = Object.keys(data);
  let true_interval_num, intervalId;

  // incrementing true interval num; Users is source of truth for trueIntervalNum
  Users.increment("true_interval_num", {
    where: { user_name }
  })
    .then(results => {
      true_interval_num = results[0][0][0].true_interval_num;
      let intervalObj = { user_name, daily_interval, true_interval_num };
      return Intervals.create(intervalObj);
    })
    .then(results => {
      // saving interval Id for later use; obtaining issues ids
      intervalId = results.dataValues.id;
      return Issues.findAll({
        where: { title: issuesList },
        attributes: ["id", "title"]
      });
    })
    .then(async results => {
      // reassign issues to be of { id, title }
      issuesList = results.map(issue => ({ id: issue.id, title: issue.title }));
      // query issuesInterval table for the last issue id (based on Created at)

      // for every issue worked on in the interval..
      for (let i = 0; i < issuesList.length; i++) {
        let entry = data[issuesList[i].title];
        let issueId = issuesList[i].id;
        let issuesIntervalsObj = {
          issueId,
          intervalId,
          user_name,
          daily_interval,
          true_interval_num,
          active: 0,
          idle: 0,
          word_count: 0
        };

        // for every file worked on per issue...
        for (let file_path in entry) {
          // filesInterval entry
          let filesIntervalObj = {
            issueId,
            intervalId,
            user_name,
            daily_interval,
            true_interval_num,
            file_path
          };

          // for every status (Running/Break) per file...
          for (let status in entry[file_path]) {
            filesIntervalObj.status = status;

            // for all info needed...
            for (let info in entry[file_path][status]) {
              filesIntervalObj[info] = entry[file_path][status][info];

              //store interval data
              if (info === "active")
                issuesIntervalsObj.active += filesIntervalObj[info];
              if (info === "idle")
                issuesIntervalsObj.idle += filesIntervalObj[info];
              if (info === "word_count")
                issuesIntervalsObj.word_count += filesIntervalObj[info];
            }
            //save FilesInterval HERE
            Files_Intervals.create(filesIntervalObj).catch(err =>
              console.error(err)
            );
          }
        }

        // async await to obtain prior time information
        let priorInterval = await Issues_Intervals.findOne({
          where: { issueId },
          attributes: ["total_active", "total_idle"],
          order: [["createdAt", "DESC"]]
        }).then(results => {
          return results === null
            ? { prior_active: 0, prior_idle: 0 }
            : {
                prior_active: results.total_active,
                prior_idle: results.total_idle
              };
        });

        // sum issue interval information (prior + current)
        issuesIntervalsObj.prior_active = priorInterval.prior_active;
        issuesIntervalsObj.prior_idle = priorInterval.prior_idle;
        issuesIntervalsObj.total_active =
          issuesIntervalsObj.active + priorInterval.prior_active;
        issuesIntervalsObj.total_idle =
          issuesIntervalsObj.idle + priorInterval.prior_idle;
        // save IssuesInterval HERE
        Issues_Intervals.create(issuesIntervalsObj).catch(error =>
          console.error(error)
        );
      }
    });
});

app.listen(PORT, () => {
  console.log(`Pomocode listening on port ${PORT}`);
});
