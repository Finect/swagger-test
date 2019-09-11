/// <reference path="../../../index.d.ts"/>

'use strict';

const Result = require('./base/result');

class TestConsumes extends Result {
  /**
   * Check accepted response
   * @param {*} definition
   * @param {*} consume
   * @param {string} method
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof TestConsumes
   */
  consume (definition, consume, method) {
    const result = [];

    if (method === 'get' || method === 'delete') return result;
    const error = this.writeResult('Should be contain consumes (accept) definition.', consume !== undefined ? 0 : 8001);
    if (error !== null) result.push(error);

    return result;
  };
}

module.exports = TestConsumes;
