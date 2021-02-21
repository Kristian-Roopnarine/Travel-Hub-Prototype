const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Users = require('./models/userSchema');
const config = require('./config');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.client,
      clientSecret: config.google.secret,
      callbackURL: 'http://localhost:5000/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('Got profile. The information is as follows..');
      const { email, given_name, family_name } = profile._json;
      let user = await Users.findOne({ email: email }).exec();
      if (!user) {
        console.log('New user, creating record..');
        user = await Users.create({
          email: email,
          firstName: given_name,
          lastName: family_name,
        });
      }
      done(null, user);
    }
  )
);
