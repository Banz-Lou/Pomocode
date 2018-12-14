const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

// Authentication and Authorization
const oauth = require('./utils/authenticate');
const { access } = require('./utils/authorize');

// GitHub Data fetch
const gitHub = require('./utils/github/github');

if (process.env !== 'production') {
	require('dotenv').config();
}

const app = express();
const { PORT } = process.env;

app.use(
	session({
		secret: 'PotatoCode',
		resave: false,
		saveUninitialized: true
	})
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/auth', oauth);
app.use('/query', gitHub);

//Initial setup
app.get('/', access, (req, res) => {
	res.send('Hello World!');
});

app.get('/login', (req, res) => {
	res.send('Please Login.');
});

app.listen(PORT, () => {
	console.log(`Pomocode listening on port ${PORT}`);
});
