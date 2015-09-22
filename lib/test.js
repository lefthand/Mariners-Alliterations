var fs = require('fs');
var find_alliterations = require("../lib/find-alliterations.js");

exports.run_test = function run_test() {
  var boxscore;
  fs.readFile('boxscore-example.json', 'utf8', function (err, data) {
    boxscore = JSON.parse(data);
    find_alliterations.process_boxscore(boxscore);
  });
};
