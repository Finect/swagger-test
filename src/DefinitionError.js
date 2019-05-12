'use strict';

class DefinitionErrorDetail {
  /**
   * @param {string} message
   * @param {number} code
   */
  constructor (message, code) {
    this.message = message;
    this.code = code;
  }
}

class DefinitionError extends Error {
  /**
   * Creates an instance of DefinitionError.
   * @param {string} message
   * @memberof DefinitionError
   */
  constructor (message) {
    super(message);
    this.name = 'DefinitionError';

    /** @type {Array<DefinitionErrorDetail>} */
    this.errors = [];
    /** @type {Array<DefinitionErrorDetail>} */
    this.warnings = [];
  }
}

module.exports.DefinitionError = DefinitionError;
module.exports.DefinitionErrorDetail = DefinitionErrorDetail;

class CollectionError extends Error {
  /**
   * Creates an instance of CollectionError.
   * @param {string} message
   * @memberof CollectionError
   */
  constructor (message) {
    super(message);
    this.name = 'CollectionError';
  }
}

module.exports.CollectionError = CollectionError;
