/// <reference path="../../../index.d.ts"/>

'use strict';

const TestResponse = require('./base/response');

class TestResponses extends TestResponse {
  /**
   * Check accepted response
   * @param {*} definition
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof TestResponses
   */
  get (definition) {
    const result = [];
    let error = this.__test(definition.responses, ['default'], 5009);
    if (error !== null) result.push(error);

    error = this.__test(definition.responses, ['200', '202', '206', '301', '302'], 5001);
    if (error !== null) result.push(error);

    return result;
  };

  /**
   * Check accepted response
   * @param {*} definition
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof TestResponses
   */
  post (definition) {
    const result = [];
    let error = this.__test(definition.responses, ['default'], 5009);
    if (error !== null) result.push(error);

    error = this.__test(definition.responses, ['400'], 5002);
    if (error !== null) result.push(error);

    error = this.__test(definition.responses, ['200', '201', '202', '204', '206'], 5003);
    if (error !== null) result.push(error);

    return result;
  };

  /**
   * Check accepted response
   * @param {*} definition
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof TestResponses
   */
  put (definition) {
    const result = [];
    let error = this.__test(definition.responses, ['default'], 5009);
    if (error !== null) result.push(error);

    error = this.__test(definition.responses, ['400'], 5004);
    if (error !== null) result.push(error);

    error = this.__test(definition.responses, ['400'], 5004);
    if (error !== null) result.push(error);

    error = this.__test(definition.responses, ['200', '202', '204', '206'], 5005);
    if (error !== null) result.push(error);

    return result;
  };

  /**
   * Check accepted response
   * @param {*} definition
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof TestResponses
   */
  patch (definition) {
    const result = [];
    let error = this.__test(definition.responses, ['default'], 5009);
    if (error !== null) result.push(error);

    error = this.__test(definition.responses, ['400'], 5006);
    if (error !== null) result.push(error);

    error = this.__test(definition.responses, ['200', '202', '204', '206'], 5007);
    if (error !== null) result.push(error);

    return result;
  };

  /**
   * Check accepted response
   * @param {*} definition
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof TestResponses
   */
  delete (definition) {
    const result = [];
    let error = this.__test(definition.responses, ['default'], 5009);
    if (error !== null) result.push(error);

    error = this.__test(definition.responses, ['200', '202', '204'], 5008);
    if (error !== null) result.push(error);

    return result;
  };

  /**
   * @param {*} responses
   * @param {Array<string>} accepted
   * @param {number} code
   * @returns {DefinitionErrorDetail}
   * @memberof TestResponses
   */
  __test (responses, accepted, code) {
    return this.accept(responses, accepted,
      'Should be contain (' + accepted.join() + ') response.', code);
  }
}

module.exports = TestResponses;
