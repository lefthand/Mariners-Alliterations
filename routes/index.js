var express = require('express');
var router = express.Router();
var posts = require("../lib/posts.js");
var redis = require("../lib/redis.js");
var passport = require('../lib/passport.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  redis.lrange('alliterations', 0, 20, function(err, replies){
    res.render('index', { title: 'Mariners Alliterations', alliterations: replies, loggedIn: req.session.passport });
  });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', loggedIn: req.session.passport });
});

router.get('/admin', function(req, res, next) {
  if (req.session.passport) {
    res.render('admin', { title: 'Admin', loggedIn: req.session.passport });
  }
  else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/login',
                                   failureFlash: false })
);


router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

router.post('/new-post', function(req, res, next) {
  posts.new_post(req.body.alliteration);
  res.redirect('/');
});

module.exports = router;
