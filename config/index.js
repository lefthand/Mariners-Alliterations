var nconf = require('nconf');

nconf
.argv()
.env('_')
.file('overrides', {
  file: 'overrides.json',
  dir: __dirname,
  search: true
})
.file('defaults', {
  file: 'defaults.json',
  dir: __dirname,
  search: true
});

module.exports = nconf;
