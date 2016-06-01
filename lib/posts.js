var redis = require("../lib/redis.js");
var twitter_client = require("../lib/twitter.js");
var environment = process.env.NODE_ENV;

exports.new_post = function new_post(post) {
  console.log('New Post: ' + post);
  redis.lpush("alliterations", post, function(error){
    if (error) {
      console.log('Post Redis Error: ' + error);
    }
  });
  if (environment === 'production') {
    twitter_client.post('statuses/update', {status: post},  function(error, tweet, response){
      if(error) { 
        console.log('Redis error: ' + error);
      }
    });
  }
};
