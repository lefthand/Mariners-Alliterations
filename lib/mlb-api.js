var http = require('http');
var xml2js = require('xml2js');

exports.getScheduleByTeamAndDate = function getScheduleByTeamAndDate(team, date, callback) {

  var url = "http://gd2.mlb.com/components/game/mlb/year_" + date.format('YYYY') + "/month_" + date.format('MM') + "/day_" + date.format('DD') + "/master_scoreboard.json";
  http.get(url, function(res){
    var body = '';
    var games = [];

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var mlbResponse = JSON.parse(body);
        // This should be in a promise to make sure all games are sent back
        mlbResponse.data.games.game.forEach(function (event) {
          if (event.home_team_name === team || event.away_team_name === team) {
            games.push(event);
          }
        });
        callback(games);
    });
  }).on('error', function(e){
    console.log("Got an error: " + url, e);
  });
};

exports.getGameResults = function getGameResults(date, game_id, callback) {

  var url = "http://gd2.mlb.com" + game_id + "/game_events.json";
  http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var mlbResponse = JSON.parse(body);
        callback(mlbResponse.data.game.inning);
    });
  }).on('error', function(e){
    console.log("Got an error: " + url, e);
  });
};

exports.getCompleteGameResults = function getCompleteGameResults(date, game_id, callback) {

  var url = "http://gd2.mlb.com" + game_id + "/boxscore.json";
  http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var mlbResponse = JSON.parse(body);
        callback(mlbResponse.data.boxscore);
    });
  }).on('error', function(e){
    console.log("Got an error: " + url, e);
  });
};

exports.getGamePlayers = function getGamePlayers(game_url, callback) {

  var url = "http://gd2.mlb.com" + game_url + "/players.xml";
  http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
      xml2js.parseString(body, function (err, result) {
        callback(result.game.team);
      });
    });
  }).on('error', function(e){
    console.log("Got an error: " + url, e);
  });
};
