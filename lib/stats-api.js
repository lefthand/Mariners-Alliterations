var https   = require('https');
var config  = require('../config');
var zlib    = require('zlib');

var ACCESS_TOKEN = config.get('xmlstats').access_token;
var USER_AGENT   = 'jbot/0.1 (http://justin.bodeutsch.com/)';

// See https://erikberg.com/api/methods Request URL Convention for
// an explanation
function buildURL(host, sport, method, id, format, params) {
  var ary = [sport, method, id];
  var path;
  var url;
  var param_list = [];
  var param_string;
  var key;

  path = ary.filter(function (element) {
    return element !== undefined;
  }).join('/');
  url = 'https://' + host + '/' + path + '.' + format;

  if (params) {
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        param_list.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      }
    }
    param_string = param_list.join('&');
    if (param_list.length > 0) {
      url += '?' + param_string;
    }
  }
  return url;
}

function getData(sport, method, id, params,callback) {
  var url;
  var default_opts;
  var chunks;
  var buffer;
  var encoding;
  var host   = 'erikberg.com';
  var format = 'json';

  url = buildURL(host, sport, method, id, format, params);

  default_opts = {
    'host': host,
    'path': url,
    'headers': {
      'Accept-Encoding': 'gzip',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
      'User-Agent': USER_AGENT
    }
  };

  https.get(default_opts, function (res) {
    chunks = [];
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });
    res.on('end', function () {
      if (res.statusCode !== 200) {
        // handle error...
        console.warn("Server did not return a 200 response!\n" + chunks.join(''));
        console.warn(res.statusCode + " was returned.\n" + chunks.join(''));
        process.exit(1);
      }
      encoding = res.headers['content-encoding'];
      if (encoding === 'gzip') {
        buffer = Buffer.concat(chunks);
        zlib.gunzip(buffer, function (err, decoded) {
          if (err) {
            console.warn("Error trying to decompress data: " + err.message);
            process.exit(1);
          }
          callback(JSON.parse(decoded));
        });
      } else {
        callback(JSON.parse(chunks.join('')));
      }
    });
  }).on('error', function (err) {
    console.warn("Error trying to contact server: " + err.message);
    process.exit(1);
  });
}

exports.getBoxscore = function getBoxscore(game_id, callback) {
  var sport  = 'mlb';
  var method = 'boxscore';
  var id     = game_id;

  var params = {
  };

  getData(sport, method, id, params, function(data){
    callback(data);
  });
};

exports.getGameResults = function getGameResults(date, game_id, callback) {
  var id     = 'events';

  var params = {
    'sport': 'mlb',
    'date': date.format('YYYYMMDD')
  };

  getData(undefined, undefined, id, params, function(events){
    events.event.forEach(function (event) {
      if (event.event_id === game_id) {
        callback(event);
      }
    });
  });
};

exports.getScheduleByTeamAndDate = function getScheduleByTeamAndDate(team, since, until, callback) {
  var sport  = 'mlb';
  var method = 'results';
  var id     = team;

  var params = {
    'season': '2015',
    'since': since,
    'until': until
  };

  getData(sport, method, id, params, function(data){
    callback(data);
  });
};



