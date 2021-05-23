'use strict';

const Plugins = require('./plugins/plugins-loader');
const beautify = require('js-beautify').js;

class Events {
  /**
   * Get postman test
   *
   * @static
   * @param {*} endpoint
   * @param {string} content
   * @param {string|number} status
   * @param {*} test
   * @returns
   * @memberof Events
   */
  static getTests (endpoint, content, status, test) {
    const plugins = new Plugins(`${__dirname}/plugins/postman`);
    plugins.load();

    let result = plugins.contentType(content, status);
    result = result.concat(plugins.status(status));

    if (test.plugins) {
      result = result.concat(plugins.definitionTests(test.plugins, endpoint, status));
    }

    if (test.raw) {
      result = result.concat(test.raw);
    }

    return {
      listen: 'test',
      script: {
        type: 'text/javascript',
        exec: beautify(result, { indent_size: 2 })
      }
    };
  }
}

module.exports = Events;
