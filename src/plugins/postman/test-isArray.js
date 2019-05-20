'use strict';

class TestIsArray {
  /**
   * Check status result
   * @param {*} params
   * @returns {string}
   * @memberof TestIsArray
   */
  isArray (params) {
    return `pm.test("${params.item} is array", function () {
      var jsonData = pm.response.json();
      pm.expect(Array.isArray(jsonData.${params.item})).to.eql(true);
    });`;
  };
}

module.exports = TestIsArray;
