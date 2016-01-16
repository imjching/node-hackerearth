var http = require('http'),
    request = require('request');

/**
 * Returns a HackerEarth API wrapper object of the specified version. Currently,
 * only version 3 is supported by this wrapper as HackerEarth has already discontinued
 * version 2.
 *
 * Available options are:
 *  - version  The API version to use (2, 3). Defaults to 3.
 *
 * @param clientSecretKey The client secret key to access the HackerEarth API
 * @param options Configuration options as described above
 * @return Instance of the HackerEarth API in the specified version
 */
function HackerEarthAPI (clientSecretKey, options) {
  if (typeof clientSecretKey != 'string') {
    clientSecretKey = null;
    options = clientSecretKey;
  }
  if (!options) {
    options = {};
  }

  if (!clientSecretKey) {
    throw new Error('You have to provide a client secret key for this to work. If you do not have one, please register your client at https://www.hackerearth.com/api/register.');
  }

  if (!options.version || options.version == '3') {
    this.version = 'v3';
  } else if (options.version == '2') {
    this.version = 'v2';
  } else {
    throw new Error('Version ' + options.version + ' of the HackerEarth API is currently not supported.');
  }

  this.clientSecretKey = clientSecretKey;
  this.httpHost        = 'api.hackerearth.com:443'
  this.httpUri         = 'https://' + this.httpHost;
  this.possibleLangs   = ['C', 'CPP', 'CPP11', 'CLOJURE', 'CSHARP', 'JAVA', 'JAVASCRIPT', 'HASKELL', 'PERL', 'PHP', 'PYTHON', 'RUBY'];
}

module.exports = HackerEarthAPI;

/**
 * Sends a given request as a HTTP POST (application/x-www-form-urlencoded) to
 * the HackerEarth API and finally calls the given callback function with the
 * resulting JSON object. This method should not be called directly but will be
 * used internally by all API methods defined.
 *
 * @param method HackerEarth API method to call
 * @param availableParams Parameters available for the specified API method
 * @param givenParams Parameters to call the HackerEarth API with
 * @param callback Callback function to call on success
 */
HackerEarthAPI.prototype.execute = function (method, availableParams, givenParams, callback) {
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

  var options = {
    uri : this.httpUri + '/' + this.version + '/' + method + '/',
    method : 'POST',
    headers : { 'Content-Type' : 'application/x-www-form-urlencoded' },
    form : finalParams
  };

  if (this.version == 'v3') {
    options.gzip = true;
    options.headers = options.headers || {};
    options.headers['Accept-Encoding'] = 'gzip,deflate';
  }

  request(options, function (error, response, body) {
    var parsedResponse;

    if (error) {
      return callback(new Error('Unable to connect to the HackerEarth API endpoint because ' + error.message));
    }

    try {
      parsedResponse = JSON.parse(body);
    } catch (error) {
      return callback(new Error('Error parsing JSON answer from HackerEarth API: ' + body));
    }

    if (response.statusCode != 200 || parsedResponse.errors) {
      return callback(new Error(parsedResponse.message));
    }

    callback(null, parsedResponse);
  });
};

/**
 * Compiles the code that is being fed into `source` in params and returns
 * the result of the compilation.
 *
 * @see https://www.hackerearth.com/docs/api/developers/code/v3/
 */
HackerEarthAPI.prototype.compile = function (params, callback) {
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

/**
 * Compiles and runs the code that is being fed into `source` in params
 * and returns the result of the code execution.
 *
 * @see https://www.hackerearth.com/docs/api/developers/code/v3/
 */
HackerEarthAPI.prototype.run = function (params, callback) {
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