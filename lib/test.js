//var fs = require('fs');
//var find_alliterations = require("../lib/find-alliterations.js");
var mlb = require("../lib/mlb-api.js");
var moment = require('moment-timezone');

var today = moment();
var today = moment("2016-05-15");

mlb.getScheduleByTeamAndDate('Mariners', today, function(events){
  if (events.length === 0) {
    console.log("No game today, too bad");
    return;
  }

  events.forEach(function (event) {

    if (event) {
      var game_date = {};
      if (Object.prototype.toString.call( event.game_media.media) === '[object Array]' ) {
        game_date = moment(new Date(event.game_media.media[0].start));
      }
      else {
        game_date = moment(new Date(event.game_media.media.start));
      }
      console.log('New Test Game: ' + game_date.tz('UTC').format('MMMM Do YYYY, h:mm:ss a') + ' ' + event.game_data_directory);
    }
    else {
      console.log("no game found");
    }
  });
});
//exports.run_test = function run_test() {
//  var boxscore;
//  fs.readFile('boxscore-example.json', 'utf8', function (err, data) {
//    boxscore = JSON.parse(data);
//    find_alliterations.process_boxscore(boxscore);
//  });
//};
