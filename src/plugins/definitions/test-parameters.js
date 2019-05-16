/// <reference path="../../../index.d.ts"/>

'use strict';

const TestResponse = require('./base/response');

class TestParameters extends TestResponse {
  /**
   * Check accepted response
   * @param {*} definition
   * @param {*} parameters
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof TestParameters
   */
  parameter (definition, parameters) {
    const result = [];
    let error;

    if (parameters === undefined) return result;

    if (parameters.some(param => ['path', 'query'].includes(param.in) &&
      param.required) && !definition['x-pm-test-ignore404']) {
      error = this.accept(definition.responses, ['404'],
        'Parameters required in PATH or QUERY, should be contain not found (404) response.', 7001);

      if (error !== null) result.push(error);
    }

    if (parameters.some(param => ['path', 'query'].includes(param.in) && param.type !== 'string')) {
      error = this.accept(definition.responses, ['400'],
        'Parameter distint of type string, in PATH or QUERY, should be contain bad request (400) response.', 7003);

      if (error !== null) result.push(error);
    }

    if (parameters.some(param => param.in === 'query' && param.required)) {
      result.push(this.writeResult(
        'Parameters required in QUERY, maybe should be change to \'in: path\' definition.', 4000));
    }

    if (parameters.some(param => param.enum !== undefined ||
      (param.type === 'array' && param.items.enum !== undefined))) {
      error = this.accept(definition.responses, ['400'],
        'Enum parameters in PATH or QUERY, should be contain bad request (400) response.', 7002);

      if (error !== null) result.push(error);
    }

    const queryParams = parameters.filter(param => param.in === 'query');
    queryParams.forEach(param => {
      error = this.__isLowerCase(param.name, 'Query string parameter [' + param.name + '] should be lower case.');

      if (error !== null) result.push(error);
    });

    return result;
  };

  /**
   * Test if str is in lower case
   * @param {string} str
   * @param {string} message
   * @returns {DefinitionErrorDetail}
   * @memberof TestParameters
   */
  __isLowerCase (str, message) {
    const ok = str === str.toLowerCase() && str !== str.toUpperCase();
    return this.writeResult(message, ok ? 0 : 7003);
  }
}

module.exports = TestParameters;
