var stats_api = require("../lib/stats-api.js");
var redis = require("../lib/redis.js");
var find_alliterations = require("../lib/find-alliterations.js");
var moment = require('moment-timezone');

function processGame(game) {
  var game_date = moment(game);
  if (moment().diff(game_date, 'hours') >= 2) {
    redis.hget("games", game, function (err, game_id) {
      if (err) {
        console.log(err);
      }
      stats_api.getGameResults(game_date, game_id, function(results){
        if (results.event_status === 'completed') {
          stats_api.getBoxscore(game_id, function(boxscore){
            find_alliterations.process_boxscore(boxscore);
          });
          redis.hdel("games", game, function(err, success) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    });
  }
  else {
    console.log(game + ' not complete.');
  }
}

exports.findGames = function findGames() {
  redis.hkeys("games", function (err, games) {
    games.forEach(function (game) {
      processGame(game);
    });
  });
};
