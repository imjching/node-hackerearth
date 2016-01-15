var HackerEarthAPI_v3 = require('./HackerEarthAPI_v3');

function HackerEarthAPI (clientSecretKey) {
  if (!clientSecretKey) {
    throw new Error('You have to provide a client secret key for this to work.');
  }

  // to support version 2.0 in the future
  return new HackerEarthAPI_v3(clientSecretKey);
}

module.exports = HackerEarthAPI;