'use strict';

class TestContentType {
  /**
   * Check accepted response
   * @param {string} produce
   * @param {string|number} status
   * @returns {string}
   * @memberof TestAccept
   */
  contentType (produce, status) {
    if (status.toString() === '204') return '';

    return `pm.test("Content-Type is present", function () {
      pm.expect(pm.response.headers.has("Content-Type", "${produce}"));
    });`;
  };
}

module.exports = TestContentType;
