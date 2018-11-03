const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

// OAuth passport requirements
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

if (process.env !== 'production') {
  require('dotenv').config();
}

const app = express();
const { PORT, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

app.use(session({ secret: 'PotatoCode' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Passport GitHub strategy use
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `http://localhost:${PORT}/auth/github/callback`
},
  (accessToken, refreshToken, profile, cb) => {
    // console.log("Access Token:", accessToken);
    // console.log("Profile:", profile);

    // grab accessToken (for github query) and username
    const UserAccess = {
      accessToken,
      username: profile.username
    };
    return cb(null, UserAccess);
  }
));


// for session use, to serialization for logging in and out
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// OAuth passport initialization
app.use(passport.initialize());
app.use(passport.session());

//Initial setup
app.get('/', (req, res) => {
  // console.log('Session:', req.session);
  res.send('Hello World!');
});

app.get('/login', (req, res) => {
  // console.log('Session:', req.session);
  res.send('Please Login.');
});

// OAuth routes
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // successful authentication, redirect home.
    res.redirect('/');
  });

app.listen(PORT, () => {
  console.log(`Pomocode listening on port ${PORT}`);
});