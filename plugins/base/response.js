'use strict';

const Result = require('./result');

class TestResponse extends Result {
  /**
   * Accept required responses
   *
   * @param {*} responses
   * @param {Array<string>} accept
   * @param {string} message
   * @param {number} code
   *
   * @returns {boolean}
   * @memberof TestResponse
   */
  accept (responses, accept, message, code) {
    const ok = Object.keys(responses).some(prop => {
      return accept.indexOf(prop) > -1;
    });

    if (ok) this.writeResult(message, 0);
    else this.writeResult(message, code);

    return ok;
  }
}

module.exports = TestResponse;
