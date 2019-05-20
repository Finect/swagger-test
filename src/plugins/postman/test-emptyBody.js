'use strict';

class TestEmptyBody {
  /**
   * Check status result
   * @param {string|number} status
   * @returns {string}
   * @memberof TestEmptyBody
   */
  status (status) {
    if (status.toString() !== '204') return '';

    return `pm.test("Body is empty", function() {
      var data = pm.response.text();
      pm.expect(data === undefined || data === '').to.eql(true);
    });`;
  }
}

module.exports = TestEmptyBody;
