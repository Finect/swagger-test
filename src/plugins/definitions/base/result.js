'use strict';

const colors = require('colors/safe');
const DefinitionErrorDetail = require('./definition-error');

class Result {
  /**
   * Write definition error
   * @param {string} message
   * @param {number} code
   * @returns {DefinitionErrorDetail}
   */
  writeResult (message, code) {
    if (code >= 5000) {
      // @ts-ignore
      process.stdout.write(`${colors.red.bold(`√ `)} ${message}\n`);
    } else if (code > 0 && code < 5000) {
      // @ts-ignore
      process.stdout.write(`${colors.yellow.bold(`√ `)} ${message}\n`);
    } else if (code === 0) {
      // @ts-ignore
      process.stdout.write(`${colors.green.bold(`√ `)} ${message}\n`);
    }

    return code > 0 ? new DefinitionErrorDetail(message, code) : null;
  };
}

module.exports = Result;
