'use strict';

class TestSetEnvironmentVariable {
  /**
   * Check status result
   * @param {*} params
   * @returns {string}
   * @memberof TestSetEnvironmentVariable
   */
  setEnvironmentVariable (params) {
    return `pm.test("Set ${params.var} to ${params.item}", function () {
      var jsonData = pm.response.json();
      pm.environment.set("${params.var}", jsonData.${params.item});
    });`;
  };
}

module.exports = TestSetEnvironmentVariable;
