"use strict";
var mlb = require("../lib/mlb-api.js");
var redis = require("../lib/redis.js");
var moment = require('moment-timezone');

exports.saveSchedule = function saveSchedule() {
  var today = moment();
//  var today = moment("2016-05-30");
  var team_name = 'Mariners';

  mlb.getScheduleByTeamAndDate(team_name, today, function(events){
    if (events.length === 0) {
      console.log("No game today, too bad");
      return;
    }
    events.forEach(function (event) {
      var game_date = {};
      // media is an array after the game is over, but it's an object before
      // It's an empty object until the game is one week away.
      if (Object.prototype.toString.call( event.game_media.media) === '[object Array]' ) {
        game_date = event.game_media.media[0].start;
      }
      else {
        game_date = moment(new Date(event.game_media.media.start));
      }
      console.log('New Game Scheduled: ' + game_date + ' ' + event.game_data_directory);
      redis.hset('games', game_date, event.id);
      // Expire this after 29 hours
      redis.hset('game-' + event.id, 'directory', event.game_data_directory);
      if (event.home_team_name === team_name) {
        redis.hset('game-' + event.id, 'tracking', 'home');
      }
      if (event.away_team_name === team_name) {
        redis.hset('game-' + event.id, 'tracking', 'away');
      }
    });
  });
};
