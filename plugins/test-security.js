'use strict';

const TestResponse = require('./base/response');

class TestSecurity extends TestResponse {
  /**
   * Check accepted response
   * @param {*} definition
   * @param {*} security
   * @memberof PostTestResponse
   */
  security (definition, security) {
    if (security === undefined) return;

    this.accept(definition.responses, ['401'],
      'Security definition, should be contain (401) response.', 6001);
  };
}

module.exports = TestSecurity;
