"use strict";

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _fs = _interopRequireDefault(require("fs"));

var _App = _interopRequireDefault(require("../src/components/App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require("express");

var session = require("express-session");

var bodyParser = require("body-parser");

var path = require("path"); //  Server-Side


var html = _fs.default.readFileSync("dist/index.html").toString();

var parts = html.split("not rendered"); // Authentication and Authorization

var oauth = require("../server/utils/authenticate");

var _require = require("../server/utils/authorize"),
    access = _require.access; // GitHub Data fetch


var gitHub = require("../server/utils/github/github"); // api helper functions


var intUpdFunct = require("../server/utils/APIfunctions/intervalUpdates"); // SQLIZE & DB Connection


var Sequelize = require("sequelize");

var _require2 = require("../database/database"),
    db = _require2.db,
    Users = _require2.Users,
    Intervals = _require2.Intervals,
    Issues = _require2.Issues,
    Issues_Intervals = _require2.Issues_Intervals,
    Files_Intervals = _require2.Files_Intervals;

if (process.env !== "production") {
  require("dotenv").config();
}

var app = express();
var PORT = process.env.PORT;
var FRED = "FRED";
var MIKE = "MIKE"; // app.use(express.static(path.join(__dirname, '/../index.html')));

app.get("/", function (req, res) {
  res.write(parts[0]);

  var reactMarkup = _react.default.createElement(_App.default, null);

  var stream = (0, _server.renderToNodeStream)(reactMarkup);
  stream.pipe(res, {
    end: false
  });
  stream.on("end", function () {
    res.write(parts[1]);
    res.end();
  });
});
app.use(session({
  secret: "PotatoCode",
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use("/auth", oauth);
app.use("/query", gitHub); //Initial setup

app.get("/login", function (req, res) {
  res.send("Please Login.");
}); // GET the last 3 interval updates

app.get("/api/intervalUpdates", function (req, res) {
  var user_name = req.query.userName; //REMOVE THIS FOR PROD
  // const user_name = 'fredricklou523';

  Intervals.max("true_interval_num", {
    where: {
      user_name: user_name
    }
  }).then(function (max) {
    //Defines number of intervals we want to pull
    var oldestInterval = max - 3;
    return Issues_Intervals.findAll({
      include: [{
        model: Issues,
        attributes: ["plan_seconds", "title"]
      }],
      where: {
        user_name: user_name,
        true_interval_num: _defineProperty({}, Sequelize.Op.gt, oldestInterval)
      }
    });
  }).then(function (records) {
    console.log(intUpdFunct);
    res.send(intUpdFunct.powerUp(records));
  });
}); //Post

app.post("/api/vsCode", function (req, res) {
  var user_name = req.body.userName;
  var daily_interval = req.body.interval;
  var data = req.body.data;
  console.log("SOME LARGE STRING BIG AND LONG"); // issues get rewritten as an array of {id: id, title: title}

  var issuesList = Object.keys(data);
  var true_interval_num, intervalId; // incrementing true interval num; Users is source of truth for trueIntervalNum

  Users.increment("true_interval_num", {
    where: {
      user_name: user_name
    }
  }).then(function (results) {
    true_interval_num = results[0][0][0].true_interval_num;
    var intervalObj = {
      user_name: user_name,
      daily_interval: daily_interval,
      true_interval_num: true_interval_num
    };
    return Intervals.create(intervalObj);
  }).then(function (results) {
    // saving interval Id for later use; obtaining issues ids
    intervalId = results.dataValues.id;
    return Issues.findAll({
      where: {
        title: issuesList
      },
      attributes: ["id", "title"]
    });
  }).then(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(results) {
      var i, entry, issueId, issuesIntervalsObj, file_path, filesIntervalObj, status, info, priorInterval;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // reassign issues to be of { id, title }
              issuesList = results.map(function (issue) {
                return {
                  id: issue.id,
                  title: issue.title
                };
              }); // query issuesInterval table for the last issue id (based on Created at)
              // for every issue worked on in the interval..

              i = 0;

            case 2:
              if (!(i < issuesList.length)) {
                _context.next = 18;
                break;
              }

              entry = data[issuesList[i].title];
              issueId = issuesList[i].id;
              issuesIntervalsObj = {
                issueId: issueId,
                intervalId: intervalId,
                user_name: user_name,
                daily_interval: daily_interval,
                true_interval_num: true_interval_num,
                active: 0,
                idle: 0,
                word_count: 0
              }; // for every file worked on per issue...

              for (file_path in entry) {
                // filesInterval entry
                filesIntervalObj = {
                  issueId: issueId,
                  intervalId: intervalId,
                  user_name: user_name,
                  daily_interval: daily_interval,
                  true_interval_num: true_interval_num,
                  file_path: file_path
                }; // for every status (Running/Break) per file...

                for (status in entry[file_path]) {
                  filesIntervalObj.status = status; // for all info needed...

                  for (info in entry[file_path][status]) {
                    filesIntervalObj[info] = entry[file_path][status][info]; //store interval data

                    if (info === "active") issuesIntervalsObj.active += filesIntervalObj[info];
                    if (info === "idle") issuesIntervalsObj.idle += filesIntervalObj[info];
                    if (info === "word_count") issuesIntervalsObj.word_count += filesIntervalObj[info];
                  } //save FilesInterval HERE


                  Files_Intervals.create(filesIntervalObj).catch(function (err) {
                    return console.error(err);
                  });
                }
              } // async await to obtain prior time information


              _context.next = 9;
              return Issues_Intervals.findOne({
                where: {
                  issueId: issueId
                },
                attributes: ["total_active", "total_idle"],
                order: [["createdAt", "DESC"]]
              }).then(function (results) {
                return results === null ? {
                  prior_active: 0,
                  prior_idle: 0
                } : {
                  prior_active: results.total_active,
                  prior_idle: results.total_idle
                };
              });

            case 9:
              priorInterval = _context.sent;
              // sum issue interval information (prior + current)
              issuesIntervalsObj.prior_active = priorInterval.prior_active;
              issuesIntervalsObj.prior_idle = priorInterval.prior_idle;
              issuesIntervalsObj.total_active = issuesIntervalsObj.active + priorInterval.prior_active;
              issuesIntervalsObj.total_idle = issuesIntervalsObj.idle + priorInterval.prior_idle; // save IssuesInterval HERE

              Issues_Intervals.create(issuesIntervalsObj).catch(function (error) {
                return console.error(error);
              });

            case 15:
              i++;
              _context.next = 2;
              break;

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
});
app.listen(PORT, function () {
  console.log("Pomocode listening on port ".concat(PORT));
});