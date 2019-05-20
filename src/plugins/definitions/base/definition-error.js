'use strict';

class DefinitionErrorDetail {
  /**
   * @param {string} message
   * @param {number} code
   */
  constructor (message, code) {
    this.message = message;
    this.code = code;
  }
}

module.exports = DefinitionErrorDetail;
