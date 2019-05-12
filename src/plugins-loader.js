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
    for (let file in list) {
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
   * @memberof Plugins
   */
  methods (def, method) {
    this.plugins.forEach(plugin => {
      if (plugin[method]) plugin[method](def);
    });
  }

  /**
   * Execute definition tests related to parameters
   *
   * @param {*} def Endpoint definition
   * @param {*} parameters
   * @memberof Plugins
   */
  parameters (def, parameters) {
    this.plugins.forEach(plugin => {
      if (plugin['parameter']) plugin['parameter'](def, parameters);
    });
  }

  /**
   * Execute definition tests related to securities
   *
   * @param {*} def Endpoint definition
   * @param {*} security
   * @memberof Plugins
   */
  securities (def, security) {
    this.plugins.forEach(plugin => {
      if (plugin['security']) plugin['security'](def, security);
    });
  }

}

module.exports = Plugins;
