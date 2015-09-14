var posts = require("./posts.js");

function match_name(letter, full_name, callback) {
  var names = full_name.match(/(.*) (.*)/);
  var first_name = names[1];
  var last_name = names[2];
  var output_name = null;
  // Allow more than one char matches
  // Look for list of exceptions when first letter isn't phonetic.
  if (last_name.substring(0,1) === letter && first_name.substring(0,1) === letter) {
    output_name = full_name;
  }
  else {
    if (first_name.substring(0,1) === letter) {
      output_name = first_name;
    }
    if (last_name.substring(0,1) === letter) {
      output_name = last_name;
    }
  }
  if (output_name !== null) {
    callback(output_name);
  }
}

function batting_alliterations(batters) {
  batters.forEach(function (batter) {
    if (batter.rbi === 1 && batter.display_name === 'Robinson Canó') {
      posts.new_post('Robbie Ribbie');
    }
    if (batter.rbi > 1 && batter.display_name === 'Robinson Canó') {
      posts.new_post('Robbie Ribbies!');
    }
    if (batter.home_runs > 0 && batter.first_name === 'Jesús') {
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

function pitching_alliterations(pitchers) {
  pitchers.forEach(function (pitcher) {
    if (pitcher.win === true) {
      match_name('R', pitcher.display_name, function(output_name){
        posts.new_post('Wooooooo! ' + output_name + ' Wins');
      });
    }
    if (pitcher.save === true) {
      match_name('W', pitcher.display_name, function(output_name){
        posts.new_post('Superb! ' + output_name + ' Saves');
      });
    }
    if (pitcher.hold === true) {
      match_name('H', pitcher.display_name, function(output_name){
        posts.new_post(output_name + ' holds');
      });
    }
    if (pitcher.pitch_count >= 100) {
      match_name('H', pitcher.display_name, function(output_name){
        posts.new_post(output_name + ' hurls a hundred');
      });
    }
    if (pitcher.strike_outs === 6) {
      match_name('S', pitcher.display_name, function(output_name){
        posts.new_post(output_name + ' strikes six');
      });
    }
    if (pitcher.strike_outs === 7) {
      match_name('S', pitcher.display_name, function(output_name){
        posts.new_post(output_name + ' strikes seven');
      });
    }
    if (pitcher.innings_pitched >= 7 || pitcher.pitch_count >= 90) {
      match_name('P', pitcher.display_name, function(output_name){
        posts.new_post(output_name + ' pitches plenty');
      });
    }
  });
}

exports.process_boxscore = function process_boxscore(boxscore) {
  var mariners_pitchers = {};
  var mariners_batters = {};
  console.log('got boxscore');
  if (boxscore.away_team.team_id === 'seattle-mariners') {
    mariners_batters = boxscore.away_batters;
    mariners_pitchers = boxscore.away_pitchers;
  }
  else {
    mariners_batters = boxscore.home_batters;
    mariners_pitchers = boxscore.home_pitchers;
  }
  pitching_alliterations(mariners_pitchers);
  batting_alliterations(mariners_batters);
};
