'use strict';

const TestResponse = require('./base/response');

class TestResponses extends TestResponse {
  /**
   * Check accepted response
   * @param {*} definition
   * @memberof TestResponses
   */
  get (definition) {
    this.__test(definition.responses, ['200', '202', '206'], 5001);
  };

  /**
   * Check accepted response
   * @param {*} definition
   * @memberof TestResponses
   */
  post (definition) {
    this.__test(definition.responses, ['400'], 5002);
    this.__test(definition.responses, ['200', '201', '202', '204', '206'], 5003);
  };

  /**
   * Check accepted response
   * @param {*} definition
   * @memberof TestResponses
   */
  put (definition) {
    this.__test(definition.responses, ['400'], 5004);
    this.__test(definition.responses, ['200', '202', '204', '206'], 5005);
  };

  /**
   * Check accepted response
   * @param {*} definition
   * @memberof TestResponses
   */
  patch (definition) {
    this.__test(definition.responses, ['400'], 5006);
    this.__test(definition.responses, ['200', '202', '204', '206'], 5007);
  };

  delete (definition) {
    this.__test(definition.responses, ['200', '202', '204'], 5008);
  };

  /**
   * @param {*} responses
   * @param {Array<string>} accepted
   * @param {number} code
   * @memberof TestResponses
   */
  __test (responses, accepted, code) {
    this.accept(responses, accepted,
      'Should be contain success (' + accepted.join() + ') response.', code);
  }
}

module.exports = TestResponses;
