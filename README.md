# node-hackerearth

[![npm status](http://img.shields.io/npm/v/node-hackerearth.svg?style=flat-square)](https://www.npmjs.org/package/node-hackerearth) [![Travis build status](https://travis-ci.org/imjching/node-hackerearth.svg?branch=master&style=flat-square&label=travis)](https://travis-ci.org/imjching/node-hackerearth)

A node.js wrapper for the HackerEarth API.

Currently, both version 2 and 3 of the HackerEarth API are supported through *node-hackerearth*. However, version 2 has been discontinued by HackerEarth.

Further information on the HackerEarth API and its features are available at [https://www.hackerearth.com/docs/api/developers/code/v3/](https://www.hackerearth.com/docs/api/developers/code/v3/).

## Table of Contents

 * [Installation](#installation)
 * [Usage](#usage)
 * [License](#license)

## Installation

Installing using npm (node package manager):

    npm install node-hackerearth

If you don't have npm installed or don't want to use it:

    cd ~/.node_libraries
    git clone git@github.com:imjching/node-hackerearth.git

Please note that parts of *node-hackerearth* depend on [request](http://github.com/mikeal/request) by [Mikeal Rogers](http://github.com/mikeal). This library needs to be installed for the API to work. If you are using npm, all dependencies should be automatically resolved for you.

## Usage

**Attention**: Support for v2 of the HackerEarth API is not yet well tested as the API endpoints have been discontinued by HackerEarth.

*HackerEarthAPI* takes two arguments. The first argument is your client secret key, which you can register one [here](https://www.hackerearth.com/api/register/). The second argument is an options object which can contain the following options:

 * `version` The API version to use (2 or 3). Defaults to 3.

The HackerEarth API provides two main functions: *compile* and *run*. These are available in this wrapper. You can use the methods `compile` and `run` and each of them takes two parameters:

 * `params` Parameters to pass to the API method
 * `callback` Callback function for returned data or errors with two parameters. The first one being an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured.

Example:

```javascript
var HackerEarthAPI = require('node-hackerearth');

var clientSecretKey = 'Your client secret key';

var api = new HackerEarthAPI(clientSecretKey);

var data = "print 'Hello World'";

api.compile({ source: data, lang: 'PYTHON' }, function (err, data) {
  if (err) {
    console.log(err.message);
  } else {
    console.log(JSON.stringify(data)); // Do something with your data
  }
});

api.run({ source: data, lang: 'PYTHON', time_limit: 1 }, function (err, data) {
  if (err) {
    console.log(err.message);
  } else {
    console.log(JSON.stringify(data)); // Do something with your data
  }
});
```

## TODO
- Complete unit tests

## License

*node-hackerearth* is licensed under the MIT License. (See LICENSE)