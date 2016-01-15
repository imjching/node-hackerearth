var HackerEarthAPI = require('node-hackerearth'),
    fs = require('fs');

var clientSecretKey = 'c7148b41da147cd90b318436bfb9ca31057378cd';
var api = new HackerEarthAPI(clientSecretKey, { version: '3'});

fs.readFile('./source.py', function (err, data) {
  if (err) {
    throw err;
  }
  api.compile({ source: data, lang: 'PYTHON' }, function (err, data) {
    console.log('Compiling code...');
    if (err) {
      console.log(err.message);
    } else {
      console.log(data);
    }
  });

  api.run({ source: data, lang: 'PYTHON' }, function (err, data) {
    console.log('Running code...');
    if (err) {
      console.log(err.message);
    } else {
      console.log(data);

      console.log('Run Output: ');
      console.log(data.run_status.output);
    }
  });
});