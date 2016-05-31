"use strict";
var stats_api = require("../lib/stats-api.js");
var redis = require("../lib/redis.js");
var find_alliterations = require("../lib/find-alliterations.js");
var moment = require('moment-timezone');
var Q = require("q");

function findGames() {
  var deferred = Q.defer();
  redis.hkeys("games", function (err, games) {
    console.log('We found a game! ' + games);
    deferred.resolve(games);
  });
  return deferred.promise;
}

function processGame(game) {
  var deferred = Q.defer();
  var game_date = moment(game);
  return deferred.promise;
  if (moment().diff(game_date, 'hours') >= 2) {
    // If the hash doesn't exist, we'd never resolve the promise.
    redis.hget("games", game, function (err, game_id) {
      if (err) {
        deferred.reject(new Error(err));
      }
      stats_api.getGameResults(game_date, game_id, function(results){
        if (results.event_status === 'completed') {
          stats_api.getBoxscore(game_id, function(boxscore){
            find_alliterations.process_boxscore(boxscore);
          });
          redis.hdel("games", game, function(err, success) {
            if (err) {
              deferred.reject(new Error(err));
            }
          });
        }
        deferred.resolve();
      });
    });
  }
  else {
    deferred.reject(new Error('Game not complete.'));
  }
  return deferred.promise;
}

findGames()
.then(function(games){
  Q.all(games.map(processGame))
  .catch(function(error){
    console.log("We got an error: " + error);
  })
  .done(function() {
    //redis.quit();
  });
})
.done();
