'use strict';

class TestSetCollectionVariable {
  /**
   * Check status result
   * @param {*} params
   * @returns {string}
   * @memberof TestSetCollectionVariable
   */
   setCollectionVariable (params) {
    return `
    // Set ${params.var} from ${params.item}
    var jsonData = pm.response.json();
    pm.collectionVariables.set("${params.var}", jsonData.${params.item});`;
  };
}

module.exports = TestSetCollectionVariable;
