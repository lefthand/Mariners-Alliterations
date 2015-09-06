var redis = require("redis").createClient('6379', process.env.redis_host);
var config = require('../config');

redis.on("error", function (err) {
    console.log("Error " + err);
});

redis.select(config.get('redis').db, function() {  });

module.exports = redis;
