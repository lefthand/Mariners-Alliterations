var mlb = require("../lib/mlb-api.js");
var redis = require("../lib/redis.js");

exports.getPlayerById = function getGetPlayerById(player_id, game_id, callback) {
  redis.get('player-' + player_id, function (err, player) {
    if (player) {
      callback(JSON.parse(player));
    }
    else {
      redis.hget("game-" + game_id, 'directory', function (err, game_url) {
        if (game_url) {
          mlb.getGamePlayers(game_url, function(players) {
            players.forEach(function(team){
              team.player.forEach(function(player){
                if (player.$.id === player_id) {
                  callback(player.$);
                  redis.set('player-' + player_id, JSON.stringify(player.$));
                }
              });
            });
          });
        }
        else {
            console.log("Errr, can't find game so we can't look up player. Game: "  + game_id);
        }
      });
    }
  });
};

