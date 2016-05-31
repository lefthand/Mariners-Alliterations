var mlb = require("../lib/mlb-api.js");
var redis = require("../lib/redis.js");
var find_alliterations = require("../lib/find-alliterations.js");
var moment = require('moment-timezone');

function processFinalResult(game, game_id, results) {
  if (results.status_ind === 'F') {
    // Process pitching stats
    redis.del("game-" + game_id);
    redis.hdel("games", game);
    console.log('Game Over');
  }
}

function processInnings(game_id, innings) {
    redis.hget("game-" + game_id, 'last_inning_processed', function (err, last_inning) {
      innings.forEach(function (inning) {
        if (last_inning <= inning.num) {
          console.log('Inning: ' + inning.num);

          redis.hget("game-" + game_id, 'tracking', function (err, tracking) {
            if (err) {
              console.log(err);
            }
            redis.hget("game-" + game_id, 'last_atbat_processed', function (err, last_atbat) {
              if (inning.top && inning.top.atbat && inning.top.atbat.length > 0) {
                inning.top.atbat.forEach(function (atbat) {
                  if (parseInt(last_atbat) < parseInt(atbat.event_num) || last_atbat === null) {
                    if (tracking === 'away') {
                      find_alliterations.process_atbat(atbat, 'batter', game_id);
                    }
                    else {
                      find_alliterations.process_atbat(atbat, 'pitcher', game_id);
                    }
                    redis.hset('game-' + game_id, 'last_atbat_processed', atbat.event_num);
                  }
                });
              }
              if (inning.bottom && inning.bottom.atbat && inning.bottom.atbat.length > 0) {
                inning.bottom.atbat.forEach(function (atbat) {
                  if (parseInt(last_atbat) < parseInt(atbat.event_num) || last_atbat === null) {
                    if (tracking === 'home') {
                      find_alliterations.process_atbat(atbat, 'batter', game_id);
                    }
                    else {
                      find_alliterations.process_atbat(atbat, 'pitcher', game_id);
                    }
                    redis.hset('game-' + game_id, 'last_atbat_processed', atbat.event_num);
                  }
                });
              }
            });
            redis.hset('game-' + game_id, 'last_inning_processed', inning.num);
          });
        }
      });
    });
}

function processGame(game) {
  var game_date = moment(new Date(game));
  if (moment().diff(game_date) >= 0) {
    console.log("Game started! " + game);
    redis.hget("games", game, function (err, game_id) {
      if (err) {
        console.log(err);
      }
      redis.hget("game-" + game_id, 'directory', function (err, game_url) {
        if (err) {
          console.log(err);
        }
        mlb.getGameResults(game_date, game_url, function(results){
          processInnings(game_id, results);
        });
      });
    });
  }
}

function completeGame(game) {
  var game_date = moment(new Date(game));
  if (moment().diff(game_date) >= 0) {
    console.log("Game started! " + game);
    redis.hget("games", game, function (err, game_id) {
      if (err) {
        console.log(err);
      }
      redis.hget("game-" + game_id, 'directory', function (err, game_url) {
        if (err) {
          console.log(err);
        }
        mlb.getCompleteGameResults(game_date, game_url, function(results){
          processFinalResult(game, game_id, results);
        });
      });
    });
  }
}

exports.findGames = function findGames() {
  redis.hkeys("games", function (err, games) {
    games.forEach(function (game) {
      processGame(game);
    });
  });
};

exports.completeGames = function completeGames() {
  redis.hkeys("games", function (err, games) {
    games.forEach(function (game) {
      completeGame(game);
    });
  });
};
