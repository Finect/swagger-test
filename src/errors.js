/// <reference path="../index.d.ts"/>

'use strict';

class DefinitionError extends Error {
  /**
   * Creates an instance of DefinitionError.
   * @param {string} message
   * @param {Array<DefinitionErrorDetail>} results
   * @memberof DefinitionError
   */
  constructor (message, results) {
    super(message);
    this.name = 'DefinitionError';

    /** @type {Array<DefinitionErrorDetail>} */
    this.results = results;
  }
}

module.exports.DefinitionError = DefinitionError;

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
