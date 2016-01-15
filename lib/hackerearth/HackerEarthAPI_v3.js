var http = require('http'),
    request = require('request');

function HackerEarthAPI_v3 (clientSecretKey) {
  this.version         = 'v3';
  this.clientSecretKey = clientSecretKey;
  this.httpHost        = 'api.hackerearth.com:443'
  this.httpUri         = 'https://' + this.httpHost;
  this.possibleLangs   = ['C', 'CPP', 'CPP11', 'CLOJURE', 'CSHARP', 'JAVA', 'JAVASCRIPT', 'HASKELL', 'PERL', 'PHP', 'PYTHON', 'RUBY'];
}

module.exports = HackerEarthAPI_v3;

//The API receives all the data via POST and returns the data as JSON
//general method to send a post request
//synchronous for now
HackerEarthAPI_v3.prototype.execute = function (method, availableParams, givenParams, callback) {
  var finalParams = { client_secret : this.clientSecretKey };
  var currentParam;

  for (var i = 0; i < availableParams.length; i++) {
    currentParam = availableParams[i];
    if (typeof givenParams[currentParam] !== 'undefined') {
      finalParams[currentParam] = givenParams[currentParam];
    }
  }

  if (!finalParams['source']) {
    return callback(new Error('You have to provide a source code for this to work.'));
  }

  if (!finalParams['lang']) {
    return callback(new Error('You have to provide a language for this to work.'));
  } else {
    if (typeof this.possibleLangs.indexOf(finalParams['lang']) == -1) {
      return callback(new Error('Language provided is not supported. Possible values are: ' + JSON.stringify(this.possibleLangs)));
    }
  }

  console.log(this.httpUri + '/' + this.version + '/' + method + '/');
  request({
    uri : this.httpUri + '/' + this.version + '/' + method + '/',
    method : 'POST',
    body : JSON.stringify(finalParams)
  }, function (error, response, body) {
    var parsedResponse;

    if (error) {
      return callback(new Error('Unable to connect to the HackerEarth API endpoint because ' + error.message));
    }

    try {
      parsedResponse = JSON.parse(body);
    } catch (error) {
      return callback(new Error('Error parsing JSON answer from HackerEarth API: ' + body));
    }

    if (response.statusCode != 200 || parsedResponse.errors != {}) {
      return callback(new Error(parsedResponse.message));
    }

    callback(null, parsedResponse);
  });
};

HackerEarthAPI_v3.prototype.compile = function (params, callback) {
  if (typeof params == 'function') {
    callback = params;
    params = {};
  }

  this.execute('code/compile', [
    'source',
    'lang',
    'input',
    'time_limit',
    'memory_limit',
    'async'
  ], params, callback);
};

HackerEarthAPI_v3.prototype.run = function (params, callback) {
  if (typeof params == 'function') {
    callback = params;
    params = {};
  }

  this.execute('code/run', [
    'source',
    'lang',
    'input',
    'time_limit',
    'memory_limit',
    'async'
  ], params, callback);
};