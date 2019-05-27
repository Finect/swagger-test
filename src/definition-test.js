/// <reference path="../index.d.ts"/>

'use strict';

const Plugins = require('./plugins/plugins-loader');
const colors = require('colors/safe');

/**
 * Execute all plugins definition tests
 *
 * @param {*} endpoint
 * @param {*} security
 * @returns {Array<DefinitionErrorDetail>}
 */
module.exports.definitionTestsPassed = (endpoint, security) => {
  let testResults = [];
  if (isNotImplemented(endpoint.def.responses)) return testResults;

  const plugins = new Plugins(`${__dirname}/plugins/definitions`);
  plugins.load();

  const consumes = endpoint.swaggerCommons.consumes || endpoint.def.consumes;
  const produces = endpoint.swaggerCommons.produces || endpoint.def.produces;
  const method = endpoint.method.toLowerCase();

  testResults = testResults.concat(plugins.methods(endpoint.def, method));
  testResults = testResults.concat(plugins.parameters(endpoint.def, endpoint.def.parameters));

  testResults = testResults.concat(plugins.consumes(endpoint.def, consumes, method));
  testResults = testResults.concat(plugins.produces(endpoint.def, produces, method));

  testResults = testResults.concat(plugins.securities(endpoint.def, security));

  return testResults;
};

function isNotImplemented (responses) {
  return Object.keys(responses).some(prop => {
    const notImplemented = Number(prop) === 501;
    // @ts-ignore
    if (notImplemented) process.stdout.write('√ ' + colors.inverse('Is not implemented.\n'));

    return notImplemented;
  });
}
