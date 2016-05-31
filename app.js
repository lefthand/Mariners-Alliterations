var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var config = require('./config');
var app = express();
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('./lib/passport');
var schedule = require('node-schedule');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  store: new RedisStore(config.get('redis')),
  resave: false, 
  saveUninitialized: false,
  secret: config.get('session_secret')
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('config', config);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var process = require('./cron/process.js');
process.findGames();
schedule.scheduleJob('* * * * *', function(){
  process.findGames();
});

process.completeGames();
schedule.scheduleJob('*/10 * * * *', function(){
  process.completeGames();
});

var game_schedule = require('./cron/schedule.js');
game_schedule.saveSchedule();
schedule.scheduleJob('52 9 * * *', function(){
  game_schedule.saveSchedule();
});

module.exports = app;
console.log('Ready to Roll');
