var assert = require('assert'),
    vows = require('vows');

var HackerEarthAPI = require('../lib/hackerearth/HackerEarthAPI');

vows.describe('HackerEarthAPI').addBatch({

  'Instantiating the HackerEarth API wrapper': {
    'without any arguments': {
      topic: function () { return new HackerEarthAPI() },
      'throws an error': function (e, topic) {
        assert.ok(e instanceof Error);
        assert.strictEqual(e.message, 'You have to provide a client secret key for this to work. If you do not have one, please register your client at https://www.hackerearth.com/api/register.');
        assert.strictEqual(topic, undefined);
      }
    },

    'with a client secret key': {
      topic: function () { return new HackerEarthAPI('secretKey') },
      'successfully creates an instance': function (e, topic) {
        assert.strictEqual(e, null);
        assert.isObject(topic);
        assert.strictEqual(topic.version, 'v3');
      }
    },

    'without a client secret key but with parameters': {
      topic: function () { return new HackerEarthAPI({ version: '3' }) },
      'throws an error': function (e, topic) {
        assert.ok(e instanceof Error);
        assert.strictEqual(e.message, 'You have to provide a client secret key for this to work. If you do not have one, please register your client at https://www.hackerearth.com/api/register.');
        assert.strictEqual(topic, undefined);
      }
    },

    'with a client secret key and parameters': {
      topic: function () { return new HackerEarthAPI('secretKey', { version: '3' }) },
      'successfully creates an instance': function (e, topic) {
        assert.strictEqual(e, null);
        assert.isObject(topic);
        assert.strictEqual(topic.version, 'v3');
      }
    },

    'with a client secret key and an unsupported version': {
      topic: function () { return new HackerEarthAPI('secretKey', { version: '1' }) },
      'throws an error': function (e, topic) {
        assert.ok(e instanceof Error);
        assert.strictEqual(e.message, 'Version 1 of the HackerEarth API is currently not supported.');
        assert.strictEqual(topic, undefined);
      }
    }
  }
}).export(module);