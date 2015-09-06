var posts = require("./posts.js");

exports.process_boxscore = function process_boxscore(boxscore) {
  if (boxscore.away_team.team_id == 'seattle-mariners') {
    mariners_batters = boxscore.away_batters;
  }
  else {
    mariners_batters = boxscore.home_batters;
  }
  mariners_batters.forEach(function (batter) {
    if (batter.rbi == 1 && batter.display_name == 'Robinson Canó') {
      posts.new_post('Robbie Ribbie');
    }
    if (batter.rbi > 1 && batter.display_name == 'Robinson Canó') {
      posts.new_post('Robbie Ribbies!');
    }
    if (batter.home_runs > 0 && batter.display_name == 'Jesús Montero') {
      posts.new_post('Jesús has homered!');
    }
    if (batter.singles > 0) {
      match_name('S', batter.display_name, function(output_name){
        posts.new_post(output_name + ' Singles');
      });
    }
    if (batter.doubles > 0) {
      match_name('D', batter.display_name, function(output_name){
        posts.new_post(output_name + ' Doubles!');
      });
    }
    if (batter.triples > 0) {
      match_name('T', batter.display_name, function(output_name){
        posts.new_post(output_name + ' Triples!');
      });
    }
    if (batter.home_runs > 0) {
      match_name('C', batter.display_name, function(output_name){
        posts.new_post(output_name + ' Crushes!');
      });
    }
    if (batter.home_runs > 0) {
      match_name('M', batter.display_name, function(output_name){
        posts.new_post(output_name + ' Mashes!');
      });
    }
    if (batter.home_runs > 0) {
      match_name('H', batter.display_name, function(output_name){
        posts.new_post(output_name + ' Homers!');
      });
    }
    if (batter.runs > 0) {
      match_name('S', batter.display_name, function(output_name){
        posts.new_post(output_name + ' Scores!');
      });
    }
    if (batter.stolen_bases > 0) {
      match_name('S', batter.display_name, function(output_name){
        posts.new_post(output_name + ' Steals');
      });
    }
    if (batter.sacrifices > 0) {
      match_name('S', batter.display_name, function(output_name){
        posts.new_post(output_name + ' Sacrifice');
      });
    }
  });
}

function match_name(letter, full_name, callback) {
  var names = full_name.match(/(.*) (.*)/);
  var first_name = names[1];
  var last_name = names[2];
  var output_name = null;
  if (last_name.substring(0,1) == letter && first_name.substring(0,1) == letter) {
    output_name = full_name;
  }
  else {
    if (first_name.substring(0,1) == letter) {
      output_name = first_name;
    }
    if (last_name.substring(0,1) == letter) {
      output_name = last_name;
    }
  }
  if (output_name != null) {
    callback(output_name);
  }
}
