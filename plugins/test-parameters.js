'use strict';

const TestResponse = require('./base/response');

class TestParameters extends TestResponse {
  /**
   * Check accepted response
   * @param {*} definition
   * @param {*} parameters
   * @memberof TestParameters
   */
  parameter (definition, parameters) {
    if (parameters === undefined) return;

    if (parameters.some(param => ['path', 'query'].includes(param.in) &&
      param.required) && !definition['x-pm-test-ignore404']) {
      this.accept(definition.responses, ['404'],
        'Parameters required in PATH or QUERY, should be contain not found (404) response.', 7001);
    }

    if (parameters.some(param => param.in === 'query' && param.required)) {
      this.writeResult(
        'Parameters required in QUERY, maybe should be use \'in: path\' parameters\n', 4000);
    }

    if (parameters.some(param => param.enum !== undefined ||
        (param.type === 'array' && param.items.enum !== undefined))) {
      this.accept(definition.responses, ['400'],
        'Enum parameters in PATH or QUERY, should be contain bad request (400) response.', 7002);
    }

    const queryParams = parameters.filter(param => param.in === 'query');
    queryParams.forEach(param => {
      this.__isLowerCase(param.name, 'Query string parameter [' + param.name + '] should be lower case.');
    });
  };

  /**
   * Test if str is in lower case
   * @param {string} str
   * @param {string} message
   * @memberof TestParameters
   */
  __isLowerCase (str, message) {
    const ok = str === str.toLowerCase() && str !== str.toUpperCase();
    this.writeResult(message, ok ? 0 : 7003);
  }
}

module.exports = TestParameters;
