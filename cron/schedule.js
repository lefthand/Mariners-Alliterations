"use strict";
var statsApi = require("../lib/stats-api.js");
var redis = require("../lib/redis.js");
var moment = require('moment-timezone');

function saveSchedule(callback) {
  var today = moment();

  statsApi.getScheduleByTeamAndDate('seattle-mariners', today.format('YYYYMMDD'), today.add(1, 'days').format('YYYYMMDD'), function(events){

    events.forEach(function (event) {
      console.log('New Game Scheduled: ' + event.event_start_date_time + ' ' + event.event_id);
      redis.hset('games', event.event_start_date_time, event.event_id);
    });
    callback();

  });

}

saveSchedule(function() {
  redis.quit();
});
