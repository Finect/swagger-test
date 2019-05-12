'use strict';

const Plugins = require('./plugins-loader');
const colors = require('colors/safe');
const DefinitionErrorDetail = require('./DefinitionError').DefinitionErrorDetail;

module.exports.definitionTestsPassed = (endpoint, security) => {
  if (isNotImplemented(endpoint.def.responses)) return true;

  const plugins = new Plugins(`${__dirname}\\plugins`);
  plugins.load();

  const consumes = endpoint.swaggerCommons.consumes || endpoint.def.consumes;
  const produces = endpoint.swaggerCommons.produces || endpoint.def.produces;

  /** @type {Array<DefinitionErrorDetail>} */
  const testPassed = [];
  let resp;

  plugins.methods(endpoint.def, endpoint.method.toLowerCase());

  if (endpoint.method === 'get') {
    testPassed = writeMessage(consumes !== undefined, 'Should be contain consumes (accept) definition.') && testPassed;
  } else if (produces === undefined) {
    resp = ['200', '202', '206'];
    testPassed = accept(endpoint.def.responses, resp,
      'Should be contain produces (content-type) definition.') && testPassed;
  }

  plugins.securities(endpoint.def, security);
  plugins.parameters(endpoint.def, endpoint.def.parameters);

  return testPassed;
};

function isNotImplemented (responses) {
  return Object.keys(responses).some(prop => {
    const notImplemented = Number(prop) === 501;
    // @ts-ignore
    if (notImplemented) process.stdout.write('√ ' + colors.inverse('Is not implemented.\n'));

    return notImplemented;
  });
}
