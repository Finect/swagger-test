'use strict';

class TestStatus {
  /**
   * Check status result
   * @param {string|number} status
   * @returns {string}
   * @memberof TestStatus
   */
  status (status) {
    return `pm.test("Status code is ${status}", function () {
      pm.response.to.have.status(${status});
    });`;
  };
}

module.exports = TestStatus;
