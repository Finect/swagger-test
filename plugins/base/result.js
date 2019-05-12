'use strict';

const colors = require('colors/safe');

class Result {
  /**
   * Write definition error
   * @param {string} message
   * @param {number} code
   */
  writeResult (message, code) {
    if (code >= 5000) {
      process.stdout.write(`${colors.red(`┼ [${code}]`).bold()} ${message}\n`);
      return;
    }

    if (code >= 4000) {
      process.stdout.write(`${colors.yellow(`√ [${code}]`).bold()} ${message}\n`);
      return;
    }

    process.stdout.write(`${colors.green(`√ `).bold()} ${message}\n`);
  };
}

module.exports = Result;
