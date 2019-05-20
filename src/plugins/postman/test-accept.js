'use strict';

class TestAccept {
  /**
   * Check accepted response
   * @param {string} accept
   * @param {string|number} status
   * @returns {string}
   * @memberof TestAccept
   */
  accept (accept, status) {
    if (status.toString() === '204') return '';

    return `pm.test("Content-Type is present", function () {
      pm.expect(pm.response.headers.has("Content-Type", "${accept}"));
    });`;
  };
}

module.exports = TestAccept;
