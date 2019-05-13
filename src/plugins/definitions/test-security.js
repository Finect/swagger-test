/// <reference path="../../../index.d.ts"/>

'use strict';

const TestResponse = require('./base/response');

class TestSecurity extends TestResponse {
  /**
   * Check accepted response
   * @param {*} definition
   * @param {*} security
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof PostTestResponse
   */
  security (definition, security) {
    const result = [];
    if (security === undefined) return result;

    const error = this.accept(definition.responses, ['401'],
      'Security definition, should be contain (401) response.', 6001);
    if (error !== null) result.push(error);

    return result;
  };
}

module.exports = TestSecurity;
