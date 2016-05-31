var posts = require("./posts.js");
var player = require("./player.js");
var moment = require('moment-timezone');
var fs = require('fs');
var game_date = '';

var adjectives;
fs.readFile('adjectives.json', 'utf8', function (err, data) {
  adjectives = JSON.parse(data);
});

function match_name(letter, first, last, callback) {
  var output_name = null;
  var re = new RegExp("^" + letter);

  if (re.exec(last) && re.exec(first)) {
    output_name = first + ' ' + last;
  }
  else {
    if (re.exec(first)) {
      output_name = first;
    }
    if (re.exec(last)) {
      output_name = last;
    }
  }
  if (output_name !== null) {
    callback(output_name);
  }
}

function addPrefix(letter, callback) {
  var prefix = '';
  if (adjectives[letter]) {
    prefix = adjectives[letter][Math.floor(Math.random() * adjectives[letter].length)] + ' ';
  }
  else {
    console.log('No adjective for "' + letter + '"');
  }
  callback(prefix);
}

function addPostfix(letter, callback) {
  var postfix = '';
  var add_date = false;

  // Hash of prefixes sorted by letter
  
  if (game_date) {
    var re = new RegExp("^" + letter);
    if (re.exec(game_date.format('dddd'))) {
      add_date = true;
    }
    if (add_date) {
      postfix = " " + game_date.format('dddd');
    }
  }
  callback(postfix);

}

function batting_alliterations(atbat, batter) {

  if (parseInt(atbat.rbi) === 1 && batter.first === 'Robinson' && batter.last === 'Cano') {
    posts.new_post('Robbie Ribbie');
  }
  if (parseInt(atbat.rbi) > 1 && batter.first === 'Robinson' && batter.last === 'Cano') {
    posts.new_post('Robbie Ribbies!');
  }

  switch(atbat.event) {
    case 'Single':
      match_name('Sh', batter.first, batter.last, function(output_name){
        posts.new_post(output_name + ' Shingled');
      });
      match_name('S(?!h)', batter.first, batter.last, function(output_name){
        addPostfix('S', function(postfix){
          posts.new_post(output_name + ' Singled' + postfix);
        });
      });
      break;
    case 'Double':
      match_name('D', batter.first, batter.last, function(output_name){
        addPrefix('D', function(prefix) {
          posts.new_post(prefix + output_name + ' Doubles!');
        });
      });
      break;
    case 'Triple':
      match_name('T(?!h)', batter.first, batter.last, function(output_name){
        addPostfix('T(?!h)', function(postfix){
          addPrefix('T', function(prefix) {
            posts.new_post(prefix + output_name + ' Tripled' + postfix + '!');
          });
        });
      });
      break;
    case 'Home Run':
      if (batter.first === 'Jesús') {
        addPrefix('H', function(prefix) {
          posts.new_post('Jesús has homered!');
        });
      }
      if (batter.first === 'Franklin' && batter.last === 'Gutierrez') {
        posts.new_post('Guti Guti Gone!');
      }
      match_name('C', batter.first, batter.last, function(output_name){
        addPrefix('C', function(prefix) {
          posts.new_post(prefix + output_name + ' Crushes!');
        });
      });
      match_name('D', batter.first, batter.last, function(output_name){
        addPrefix('D', function(prefix) {
          posts.new_post(prefix + output_name + ' Dinger!');
        });
      });
      match_name('H', batter.first, batter.last, function(output_name){
        addPrefix('H', function(prefix) {
          posts.new_post(prefix + output_name + ' Homers!');
        });
      });
      match_name('M', batter.first, batter.last, function(output_name){
        addPostfix('M', function(postfix){
          addPrefix('M', function(prefix) {
            posts.new_post(prefix + output_name + ' Mashes' + postfix + '!');
          });
        });
      });
      match_name('S', batter.first, batter.last, function(output_name){
        addPostfix('S', function(postfix){
          addPrefix('S', function(prefix) {
            posts.new_post(prefix + output_name + ' Smash' + postfix + '!');
          });
        });
      });
      break;
    case 'Walk':
      match_name('W', batter.first, batter.last, function(output_name){
        posts.new_post(output_name + ' walks once');
      });
      break;
  /*
    if (batter.runs > 0) {
      match_name('Sh', batter.first, batter.last, function(output_name){
        posts.new_post(output_name + ' Shcores!');
      });
      match_name('S(?!h)', batter.first, batter.last, function(output_name){
        addPostfix('S', function(postfix){
          addPrefix('S', function(prefix) {
            posts.new_post(prefix + output_name + ' Scored' + postfix + '!');
          });
        });
      });
    }
    if (batter.stolen_bases > 0) {
      match_name('Sh', batter.first, batter.last, function(output_name){
        posts.new_post(output_name + ' Shteals');
      });
      match_name('S(?!h)', batter.first, batter.last, function(output_name){
        addPostfix('S', function(postfix){
          addPrefix('S', function(prefix) {
            posts.new_post(prefix + output_name + ' Steals' + postfix);
          });
        });
      });
    }
    if (batter.sacrifices > 0) {
      match_name('S(?!h)', batter.first, batter.last, function(output_name){
        addPostfix('S', function(postfix){
          posts.new_post(output_name + ' Sacrifice' + postfix);
        });
      });
    }
  */
  }
}

function pitching_alliterations(pitchers) {
  pitchers.forEach(function (pitcher) {
    if (pitcher.win === true) {
      match_name('W', pitcher.display_name, function(output_name){
        addPrefix('W', function(prefix){
          addPostfix('W', function(postfix){
            posts.new_post(prefix + output_name + ' Wins' + postfix);
          });
        });
      });
    }
    if (pitcher.save === true) {
      match_name('S', pitcher.display_name, function(output_name){
        addPostfix('S', function(postfix){
          addPrefix('S', function(prefix){
            posts.new_post(prefix + output_name + ' Saves' + postfix);
          });
        });
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
        addPostfix('S', function(postfix){
          posts.new_post(output_name + ' strikes six' + postfix);
        });
      });
    }
    if (pitcher.strike_outs === 7) {
      match_name('S', pitcher.display_name, function(output_name){
        addPostfix('S', function(postfix){
          addPrefix('S', function(prefix){
            posts.new_post(prefix + output_name + ' strikes seven' + postfix);
          });
        });
      });
    }
    if (pitcher.innings_pitched >= 7 || pitcher.pitch_count >= 90) {
      match_name('P', pitcher.display_name, function(output_name){
        posts.new_post(output_name + ' pitches plenty');
      });
    }
  });
}

exports.process_atbat = function process_atbat(atbat, player_type, game_id) {
  if (player_type === 'pitcher') {
    player.getPlayerById(atbat.batter, game_id, function(player) {
      console.log("Process Pitcher: " + atbat.event_num + " - " + atbat.event + " - " + player.last + " - " + atbat.des);
      //pitching_alliterations(atbat, player);  
    });
  }
  else if (player_type === 'batter') {
    player.getPlayerById(atbat.batter, game_id, function(player) {
      console.log("Process Batter: " + atbat.event_num + " - " + atbat.event + " - " + player.last + " - " + atbat.des + " - " + atbat.rbi);
      batting_alliterations(atbat, player);  
    });
  }
};

exports.process_boxscore = function process_boxscore(boxscore) {
  var mariners_pitchers = {};
  var mariners_batters = {};

  game_date = moment(boxscore.event_information.start_date_time);

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
