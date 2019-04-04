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
         { "active": 5,
           "wordCount": 9,
           "idle": 0,
           "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" } },
     "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx":
      { "Running":
         { "active": 9,
           "wordCount": 7,
           "idle": 3,
           "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" },
        "Break":
         { "active": 0,
           "wordCount": 0,
           "idle": 0,
           "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" } } },
      "VScode Extension - Data Capture":
           { "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/App.jsx":
              { "Running":
                 { "active": 10,
                   "wordCount": 50,
                   "idle": 0,
                   "git_id": "MDU6SXNzdWUzNjkzMDY5ODI=" } },
             "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx":
              { "Running":
                 { "active": 20,
                   "wordCount": 27,
                   "idle": 30,
                   "git_id": "MDU6SXNzdWUzNjkzMDY5ODI=" },
                "Break":
                 { "active": 5,
                   "wordCount": 0,
                   "idle": 5,
                   "git_id": "MDU6SXNzdWUzNjkzMDY5ODI=" } } } },
  "userName": "fredricklou523",
  "gitRepoUrl": "https://github.com/teamPERSEUS/PomoCodo-Extension",
  "idle": 4 }
  

  

  { "interval": 2,
   "data": { 
     "VScode - Microservice Set Up":
   { "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/App.jsx":
      { "Running":
         { "active": 5,
           "wordCount": 9,
           "idle": 0,
           "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" } },
     "/Users/fredricklou/Documents/HackReactor/HR33/hrr33-recast.ly/src/components/VideoList.jsx":
      { "Running":
         { "active": 9,
           "wordCount": 7,
           "idle": 3,
           "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" },
        "Break":
         { "active": 0,
           "wordCount": 0,
           "idle": 0,
           "git_id": "MDU6SXNzdWUzNzE4NjIxOTg=" } } }
     },
  "userName": "fredricklou523",
  "gitRepoUrl": "https://github.com/teamPERSEUS/PomoCodo-Extension",
  "idle": 4 }