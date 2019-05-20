'use strict';

class TestIsObject {
  /**
   * Check status result
   * @param {*} params
   * @returns {string}
   * @memberof TestIsObject
   */
  isObject (params) {
    return `pm.test("${params.item} is object", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.${params.item} && typeof jsonData.${params.item} === 'object' &&
        jsonData.${params.item}.constructor === Object).to.eql(true);
    });`;
  };
}

module.exports = TestIsObject;
