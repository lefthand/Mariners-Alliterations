var Twitter = require('twitter');
var config = require('../config');
var twitter_client = new Twitter({
  consumer_key: config.get('twitter').consumer_key,
  consumer_secret: config.get('twitter').consumer_secret,
  access_token_key: config.get('twitter').access_token_key,
  access_token_secret: config.get('twitter').access_token_secret
});

module.exports = twitter_client;
