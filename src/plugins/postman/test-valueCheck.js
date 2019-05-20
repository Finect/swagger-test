'use strict';

class TestValueCheck {
  /**
   * Check status result
   * @param {*} params
   * @returns {string}
   * @memberof TestValueCheck
   */
  valueCheck (params) {
    return `pm.test("${params.item} is ${params.value}", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.${params.item}).to.eql(${params.value});
    });`;
  };
}

module.exports = TestValueCheck;
