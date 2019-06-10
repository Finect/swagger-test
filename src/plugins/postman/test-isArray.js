'use strict';

class TestIsArray {
  /**
   * Check status result
   * @param {*} params
   * @returns {string}
   * @memberof TestIsArray
   */
  isArray (params) {
    const varName = params && params.item ? params.item : 'body';

    return `pm.test("${varName} is array", function () {
      var jsonData = pm.response.json();
      pm.expect(Array.isArray(${varName === 'body' ? 'jsonData' : `jsonData.${params.item}`})).to.eql(true);
    });`;
  };
}

module.exports = TestIsArray;
