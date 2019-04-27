'use strict';

const colors = require('colors');
const _ = require('underscore');

colors.setTheme({
    info: 'green',
    error: 'red',
    warn: 'yellow'
  });

module.exports.definitionTestsPassed = (endpoint, globalSecurity) => {

    if (isNotImplemented(endpoint.def.responses)) return true;

    let testPassed = true;
    let resp;
    switch(endpoint.method)
    {
        case 'get':
            resp = ['200','202','206'];
            testPassed = accept(endpoint.def.responses, resp, 'Should be contain success ('+resp.join()+') response.') && testPassed;
            break;
        case 'post':
            resp = ['400'];
            testPassed = accept(endpoint.def.responses, resp, 'Should be contain bad request ('+resp.join()+') response.') && testPassed;

            resp = ['200','201','202','204','206'];
            testPassed = accept(endpoint.def.responses, resp, 'Should be contain success ('+resp.join()+') response.') && testPassed;
            break;
        case 'patch':
        case 'put':
            resp = ['400'];
            testPassed = accept(endpoint.def.responses, resp, 'Should be contain bad request ('+resp.join()+') response.') && testPassed;

            resp = ['200','202','204','206'];
            testPassed = accept(endpoint.def.responses, resp, 'Should be contain success ('+resp.join()+') response.') && testPassed;
            break;
        case 'delete':
            resp = ['200','202','204'];
            testPassed = accept(endpoint.def.responses, resp, 'Should be contain success ('+resp.join()+') response.') && testPassed;
    }

    if (globalSecurity)
    {
        testPassed = accept(endpoint.def.responses,['401'], 'Enpoint security required: Should be contain (401) response.') && testPassed;
    }

    if (endpoint.def.parameters && _.some(endpoint.def.parameters, {in: 'path'}) && !endpoint.def['x-pm-test-ignore404'])
    {
        testPassed = accept(endpoint.def.responses,['404'], 'Parameters in PATH require not found (404) response.') && testPassed;
    }

    let queryParams = _.where(endpoint.def.parameters, {in: 'query'});
    queryParams.forEach(param => {
        testPassed = isLowerCase(param.name, 'Query string parameter ['+param.name+'] Should be lower case.') && testPassed;        
    });

    return testPassed;
}

function isNotImplemented(responses)
{
    return Object.keys(responses).some(function(prop){
        const notImplemented = prop.indexOf(501) > -1 || prop.indexOf("501") > -1;
        if (notImplemented) process.stdout.write(colors.warn('√ ') + 'Is not implemented.\n');

        return notImplemented;
    });

}

function accept(responses, accept, message)
{
    let ok = Object.keys(responses).some(function(prop){
        return accept.indexOf(prop) > -1;
    });

    writeMessage(ok, message);;
    return ok;
}

function isLowerCase(str, message)
{
    let ok = str == str.toLowerCase() && str != str.toUpperCase();

    writeMessage(ok, message);;
    return ok;
}

function writeMessage(result, message)
{
  process.stdout.write((result ? colors.info('√ ') : colors.error('† ')) + message + '\n');
}