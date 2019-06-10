'use strict';

class TestSchema {
  /**
   * Check status result
   * @param {*} params
   * @param {*} endpoint
   * @param {string|number} status
   * @returns {string}
   * @memberof TestSchema
   */
  testSchema (params, endpoint, status) {
    return `
    // Test whether the response matches the schema
    const responseSchema = ${JSON.stringify(endpoint.def.responses[status].schema)};

    var response = JSON.parse(responseBody);
    tests["Schema is valid"] = tv4.validate(response, responseSchema);`;
  };
}

module.exports = TestSchema;
