const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db');
passport.use(new GoogleStrategy({
clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
try {
const email = profile.emails[0].value;
// Check if a user with this Google ID or email already exists
let result = await pool.query('SELECT * FROM users WHERE google_id = $1 OR email = $2',
[profile.id, email]);
let user;
if (result.rows.length > 0) {
user = result.rows[0];
// Link google_id if they'd previously signed up with email/password
if (!user.google_id) {
await pool.query('UPDATE users SET google_id = $1, auth_provider = $2 WHERE id = $3',
[profile.id, 'google', user.id]);
}
} else {
// Default new Google sign-ups to the Patient role — adjust role_id to match your roles
const roleResult = await pool.query("SELECT id FROM roles WHERE name = 'Patient'");
const roleId = roleResult.rows[0].id;
const insertResult = await pool.query(
`INSERT INTO users (email, google_id, auth_provider, role_id) VALUES ($1, $2, 'google',
$3) RETURNING *`,
[email, profile.id, roleId]
);
user = insertResult.rows[0];
}
return done(null, user);
} catch (err) {
return done(err, null);
}
}));
module.exports = passport;