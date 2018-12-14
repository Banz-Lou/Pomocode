const express = require('express');
const router = express.Router();
const { Users } = require('../../database/database');

// OAuth passport requirements
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

if (process.env !== 'production') {
	require('dotenv').config();
}

const { PORT, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

// Passport GitHub strategy use
passport.use(
	new GitHubStrategy(
		{
			clientID: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			callbackURL: `http://localhost:${PORT}/auth/github/callback`
		},
		async (accessToken, refreshToken, profile, cb) => {
			// update(find) or create User in db
			try {
				await Users.upsert({
					gitID: profile.id,
					username: profile.username
				});
				return cb(null, {
					accessToken,
					username: profile.username
				});
			} catch (err) {
				console.log('Failed to find user. Err:', err);
				return cb(null, false, { message: 'Incorrect user.' });
			}
		}
	)
);

// for session use, serialization for logging in and out
passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((obj, cb) => {
	cb(null, obj);
});

router.use(passport.initialize());
router.use(passport.session());

// OAuth routes
router.get('/github', passport.authenticate('github'));

router.get(
	'/github/callback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	(req, res) => {
		// successful authentication, redirect home.
		res.redirect('/');
	}
);

module.exports = router;
