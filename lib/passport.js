var config = require('../config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username !== 'admin') {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (password !== config.get('admin_password')) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, { name: 'admin' });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
