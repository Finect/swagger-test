'use strict';

const Item = require('postman-collection').Item;
const Events = require('./events');


const vkbeautify = require('vkbeautify');
const _ = require('underscore');
const path = require('path');

class Endpoint {
    constructor(method, url, def, swaggerCommons)
    {
        this.method = method;
        this.url = url;
        this.def = def;
        this.swaggerCommons = swaggerCommons;

        this.postmanItems = [];
    }

    export(globalTests, security){
        this.globalTests = {
            parameters: globalTests && globalTests['params'] || [], 
            tests: globalTests && globalTests['tests'] || [] 
        };

        this.security = security;

        buildPostmanItems(this);
        return this.postmanItems; 
    }
}

function buildPostmanItems(endpoint)
{
    const produces = endpoint.def.produces || endpoint.swaggerCommons.produces;
    const consumes = endpoint.def.consumes || endpoint.swaggerCommons.consumes;

    consumes.forEach(content => {
        produces.forEach(accept => {
            _.each(endpoint.def.responses, (response, /** @type {string} */status) =>
            {
                let tests = response['x-pm-test'] || [];
                if (tests.length == 0 && status !== 'default') tests = buildDefaultsTest(endpoint, status);
    
                let globalParameters = endpoint.globalTests.parameters.filter((p) => {
                    let responses = p.except && p.except.responses || [];
                    let methods = p.except && p.methods || [];
    
                    return !responses.map(String).includes(status) && !methods.includes(endpoint.method); 
                });
    
                let globalTests = getGlobalsTest(endpoint, status);             
                tests.forEach(test => {
                    test.params = test.params || [];

                    // add globals parameters if not exist in test
                    test.params = (globalParameters || []).filter(dp => dp.in != 'body').reduce((acc, p) => {
                        if (!acc.find(pl => pl.name == p.name && pl.in == p.in)) acc.push(p);
                        return acc;
                    }, test.params);

                    //add all parameters in defenition if not exist in test
                    test.params = (endpoint.def.parameters || []).filter(dp => dp.in != 'body').reduce((acc, p) => {
                        if (!acc.find(pl => p.name == pl.name && p.in == pl.in)) acc.push({
                            name: p.name,
                            in: p.in,
                            value: p['x-pm-test-value'] || p.default || p.minimum || defaultVal(p),
                            disabled: true
                        });
                        
                        return acc;
                    }, test.params);

                    test.raw = (test.raw || '') + globalTests;

                    if (status !== '401' && endpoint.security && !test.params.find(p => endpoint.security.param.name == p.name 
                        && endpoint.security.param.in == p.in)) test.params.push(endpoint.security.param);

                    endpoint.postmanItems.push(buildPostmanItem(endpoint.method, endpoint.url, test, content, accept, status));
                });
            });
        });
    });
}

function getGlobalsTest(endpoint, status)
{
    let raw = '';
    endpoint.globalTests.tests.forEach(test => {
        if (!test.except.responses.map(String).includes(status) && !test.except.methods.includes(endpoint.method))
        {
            raw += test.raw;
        }
    });

    return raw;
}

function buildDefaultsTest(endpoint, status)
{
    let tests = [
        {
            "description": '['+ status + ']' + ' on ' + endpoint.url,
        }  
    ];

    if (!endpoint.def.parameters) return tests;

    tests[0].params = [];
    endpoint.def.parameters.forEach(parameter => {
        tests[0].params.push({
            name: parameter.name,
            in: parameter.in,
            value: parameter['x-pm-test-value'] || parameter.default || parameter.minimum || defaultVal(parameter),
            disabled: !parameter.required
        });
    });

    return tests;
}

function buildPostmanItem(method, url, test, content, accept, status)
{
    let headerParam = _.where(test.params, { in: 'header'});
    let pathParameters = _.where(test.params, {in: 'path'});
    const formParameters = _.where(test.params, {in: 'formData'});
    let urlVariables = [];

    let bodyParam = _.find(test.params, { in: 'body'});

    pathParameters.forEach(p => {
        urlVariables.push({ key: p.name, value: p.value });
        url = url.replace('{'+p.name+'}', ':'+p.name);
    });

    let item = new Item({
        name: (test.description || '['+ status + ']' + ' on ' + url).replace('[url]', url),
        request: {
            method: method,
            url: {
                // @ts-ignore
                raw: '{{base-url}}'+ url,
                host: [ '{{base-url}}' ],
                path: url.split('/'),
                query: []
            },
            // @ts-ignore
            header: [
                { key: 'accept', value: accept },
                { key: 'content-type', value: content }
            ]
        }
    });

    _.where(test.params, { in: 'query' })
        .map(p => {
            item.request.url.query.members.push({key: p.name, value: p.value.toString(), disabled: p.disabled });
        });

    if (headerParam.length > 0) {
       headerParam.forEach(header => {
            item.request.headers.members.push({key: header.name, value: header.value, disabled: header.disabled});
       });  
    }

    if (urlVariables.length > 0) item.request.url.variable = urlVariables;

    if (formParameters) {
      item.request.body = { mode: 'formData', formdata: [] };

      formParameters.forEach(form => {
        item.request.body.formdata.push({
          key: form.name, 
          value: form.type !== 'file' ? form.value : undefined,
          src: form.type === 'file' ? form.value : undefined, 
          type: form.type
        });
      });  
    }

    if (bodyParam) {
        item.request.body = { mode: 'raw', raw: undefined };

        if (content.endsWith('xml')) item.request.body.raw = vkbeautify.xml(bodyParam[content]);
        else if (content.endsWith('json')) item.request.body.raw = vkbeautify.json(bodyParam[content]);
        else item.request.body.raw = bodyParam[content];
    }   

    item.events.add(Events.getTests(accept, status, test.raw));

    return item;
}

function defaultVal(parameter) {
    if (parameter.in === 'body') return '';

    let type = parameter.items ? parameter.items.type : parameter.type;    
    if (typeof type !== 'string') throw new TypeError('Type must be a string.');

    // Handle simple types (primitives and plain function/object)
    switch (type) {
        case 'boolean'   : return 'false';
        case 'integer'   : 
        case 'number'    : return '0';
        case 'string'    : {
            // TODO: check format (date, date-time, enums, etc.)
            return 'string'; 
        }
        default : return '';
    }
}

module.exports = Endpoint;