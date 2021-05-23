/// <reference types="../../"/>

'use strict';

const fs = require('fs');

class Plugins {
  /**
   * Creates an instance of Plugins.
   * @param {string} path
   * @memberof Plugins
   */
  constructor (path) {
    this.path = path;
    this.plugins = [];
  }

  load () {
    var list = fs.readdirSync(this.path);
    for (let file of list) {
      file = this.path + '/' + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) continue;

      const Plugin = require(file);
      this.plugins.push(new Plugin());
    }
  }

  /**
   * Execute definition tests related to methods/responses
   *
   * @param {*} def Endpoint definition
   * @param {string} method Method
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof Plugins
   */
  methods (def, method) {
    let result = [];
    this.plugins.forEach(plugin => {
      if (plugin[method]) result = result.concat(plugin[method](def));
    });

    return result;
  }

  /**
   * Execute definition tests related to parameters
   *
   * @param {*} def Endpoint definition
   * @param {*} parameters
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof Plugins
   */
  parameters (def, parameters) {
    let result = [];
    this.plugins.forEach(plugin => {
      if (plugin['parameter']) result = result.concat(plugin['parameter'](def, parameters));
    });

    return result;
  }

  /**
   * Execute definition tests related to securities
   *
   * @param {*} def Endpoint definition
   * @param {*} security
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof Plugins
   */
  securities (def, security) {
    let result = [];
    this.plugins.forEach(plugin => {
      if (plugin['security']) result = result.concat(plugin['security'](def, security));
    });

    return result;
  }

  /**
   * Execute definition test related to consumes
   *
   * @param {*} def
   * @param {*} consume
   * @param {String} method
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof Plugins
   */
  consumes (def, consume, method) {
    let result = [];
    this.plugins.forEach(plugin => {
      if (plugin['consume']) result = result.concat(plugin['consume'](def, consume, method));
    });

    return result;
  }

  /**
   * Execute definition test related to produces
   *
   * @param {*} def
   * @param {*} produce
   * @param {string} method
   * @returns {Array<DefinitionErrorDetail>}
   * @memberof Plugins
   */
  produces (def, produce, method) {
    let result = [];
    this.plugins.forEach(plugin => {
      if (plugin['produce']) result = result.concat(plugin['produce'](def, produce, method));
    });

    return result;
  }

  /**
   * Check accepted response
   * @param {string} produce
   * @param {string|number} status
   * @returns {string}
   */
  contentType (produce, status) {
    let result = '';
    this.plugins.forEach(plugin => {
      if (plugin['contentType']) result = result.concat(plugin['contentType'](produce, status));
    });

    return result;
  }

  /**
   * Check accepted response
   * @param {string|number} status
   * @returns {string}
   */
  status (status) {
    let result = '';
    this.plugins.forEach(plugin => {
      if (plugin['status']) result = result.concat(plugin['status'](status));
    });

    return result;
  }

  /**
   * External definition test
   * @param {Array<*>} tests
   * @param {*} endpoint
   * @param {string|number} status
   * @returns {string}
   */
  definitionTests (tests, endpoint, status) {
    let result = '';
    tests.forEach(test => {
      this.plugins.forEach(plugin => {
        if (plugin[test.name]) result = result.concat(plugin[test.name](test.params, endpoint, status));
      });
    });

    return result;
  }
}

module.exports = Plugins;
