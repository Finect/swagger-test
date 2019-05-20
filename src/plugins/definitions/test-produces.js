/// <reference path="../../../index.d.ts"/>

'use strict';

const Result = require('./base/result');

class TestProduces extends Result {
  /**
   * Check accepted response
   * @param {*} definition
   * @param {*} produce
   * @param {string} method
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof TestProduces
   */
  produce (definition, produce, method) {
    const result = [];

    if (method === 'get') return result;
    const error = this.writeResult('Should be contain produces (content-type) definition.',
      produce !== undefined ? 0 : 8001);

    if (error !== null) result.push(error);
    return result;
  };
}

module.exports = TestProduces;
