'use strict';

class TestSetEnvironmentVariable {
  /**
   * Check status result
   * @param {*} params
   * @returns {string}
   * @memberof TestSetEnvironmentVariable
   */
   setEnvironmentVariable (params) {
    return `
    // Set ${params.var} from ${params.item}
    var jsonData = pm.response.json();
    pm.environment.set("${params.var}", jsonData.${params.item});`;
  };
}

module.exports = TestSetEnvironmentVariable;
