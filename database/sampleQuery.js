IntervalQuery.max('trueintervalid', { where: { user: user } })
.then(max => {
  const display = 5;
  IntervalQuery.selectAll({
    where: { trueintervalid >= (max - display) }
  })

})


//sample Postman Ready Data
{ "interval": 1,
   "data": { 
     "VScode - Microservice Set Up":
   { "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/App.jsx":
      { "Running":
         { "time": 5,
           "wordCount": 9,
           "idleTime": 0,
           "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" } },
     "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx":
      { "Running":
         { "time": 9,
           "wordCount": 7,
           "idleTime": 3,
           "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" },
        "Break":
         { "time": 0,
           "wordCount": 0,
           "idleTime": 0,
           "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" } } },
      "VScode Extension - Data Capture":
           { "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/App.jsx":
              { "Running":
                 { "time": 10,
                   "wordCount": 50,
                   "idleTime": 0,
                   "git_id": "MDU6SXNzdWUzNjkzMDY5ODI=" } },
             "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx":
              { "Running":
                 { "time": 20,
                   "wordCount": 27,
                   "idleTime": 30,
                   "git_id": "MDU6SXNzdWUzNjkzMDY5ODI=" },
                "Break":
                 { "time": 5,
                   "wordCount": 0,
                   "idleTime": 5,
                   "git_id": "MDU6SXNzdWUzNjkzMDY5ODI=" } } } },
  "userName": "fredricklou523",
  "gitRepoUrl": "https://github.com/teamPERSEUS/PomoCodo-Extension",
  "idleTime": 4 }