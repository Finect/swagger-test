// @ts-nocheck
'use strict';

const Item = require('postman-collection').Item;
const vkbeautify = require('vkbeautify');
const jsf = require('json-schema-faker').default;

const Events = require('./events');

class Endpoint {
  /**
   * Creates an instance of Endpoint.
   * @param {string} method
   * @param {string} url
   * @param {*} def
   * @param {*} swaggerCommons
   * @memberof Endpoint
   */
  constructor (method, url, def, swaggerCommons) {
    this.method = method;
    this.url = url;
    this.def = def;
    this.swaggerCommons = swaggerCommons;

    this.postmanItems = [];
  }

  export (globalTests, security) {
    this.globalTests = {
      parameters: (globalTests && globalTests['params']) || [],
      tests: (globalTests && globalTests['tests']) || []
    };

    this.security = security &&
      this.def.security &&
      this.def.security.length === 0 ? undefined : security;

    buildPostmanItems(this);
    return this.postmanItems;
  }
}

function buildPostmanItems (endpoint) {
  /** @todo Only support application/json */
  const content = (endpoint.def.produces && endpoint.def.produces[0]) ||
    (endpoint.swaggerCommons.produces && endpoint.swaggerCommons.produces[0]) || undefined;

  const accept = (endpoint.def.consumes && endpoint.def.consumes[0]) ||
    (endpoint.swaggerCommons.consumes && endpoint.swaggerCommons.consumes[0]) || undefined;

  Object.keys(endpoint.def.responses).forEach(status => {
    const response = endpoint.def.responses[status];

    let tests = response['x-pm-test'] || [];
    if (tests.length === 0 && status !== 'default') tests = buildDefaultsTest(endpoint, status);

    const globalParameters = endpoint.globalTests.parameters.filter(p => {
      const responses = (p.except && p.except.responses) || [];
      const methods = (p.except && p.methods) || [];

      return !responses.map(String).includes(status) && !methods.includes(endpoint.method);
    });

    const globalTests = getGlobalsTest(endpoint, status);
    tests.forEach(test => {
      test.params = test.params || [];

      // add globals parameters if not exist in test
      test.params = (globalParameters || []).filter(dp => dp.in !== 'body').reduce((acc, p) => {
        if (!acc.find(pl => pl.name === p.name && pl.in === p.in)) acc.push(p);
        return acc;
      }, test.params);

      //add all parameters in definition if not exist in test
      test.params = (endpoint.def.parameters || []).filter(dp => dp.in !== 'body').reduce((acc, p) => {
        if (!acc.find(pl => p.name === pl.name && p.in === pl.in)) {
          acc.push({
            name: p.name,
            in: p.in,
            value: p['x-pm-test-value'] || p.default || p.minimum || defaultVal(p),
            disabled: true
          });
        }

        return acc;
      }, test.params);

      test.raw = (test.raw || '') + globalTests;

      if (status !== '401' && endpoint.security &&
        !test.params.find(p => endpoint.security.param.name === p.name &&
          endpoint.security.param.in === p.in)) test.params.push(endpoint.security.param);

      endpoint.postmanItems.push(buildPostmanItem(endpoint, test, content, accept, status));
    });
  });
}

function getGlobalsTest (endpoint, status) {
  let raw = '';
  endpoint.globalTests.tests.forEach(test => {
    if (!test.except.responses.map(String).includes(status) && !test.except.methods.includes(endpoint.method)) {
      raw += test.raw;
    }
  });

  return raw;
}

function buildDefaultsTest (endpoint, status) {
  const tests = [{
    description: `['${status}'] ${endpoint.def.responses[status].description}`,
  }];

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

function buildPostmanItem (endpoint, test, content, accept, status) {
  let url = endpoint.url;

  const headerParam = test.params.filter(param => param.in === 'header');
  const pathParameters = test.params.filter(param => param.in === 'path');
  const formParameters = test.params.filter(param => param.in === 'formData');
  const urlVariables = [];

  const bodyParam = test.params.find(param => param.in === 'body');

  pathParameters.forEach(param => {
    urlVariables.push({ key: param.name, value: param.value.toString() });
    url = url.replace(`{${param.name}}`, param.variable ? `{{${param.name}}}` : `:${param.name}`);
  });

  const item = new Item({
    name: (test.description || `[${status}] on ${url}`).replace('[url]', url),
    request: {
      method: endpoint.method,
      url: `{{base-url}}${url}`,
      // @ts-ignore
      header: [
        { key: 'accept', value: accept },
        { key: 'content-type', value: content }
      ]
    }
  });

  test.params.filter(param => param.in === 'query')
    .map(param => {
      item.request.url.query.members.push({
        key: param.name,
        value: param.value.toString(),
        disabled: param.disabled
      });
    });

  if (headerParam.length > 0) {
    headerParam.forEach(header => {
      item.request.headers.members.push({
        key: header.name,
        value: header.value,
        disabled: header.disabled
      });
    });
  }

  if (urlVariables.length > 0) item.request.url.variable = urlVariables;

  if (formParameters) {
    item.request.body = { mode: 'formData', formdata: [] };

    formParameters.forEach(form => {
      item.request.body.formdata.push({
        key: form.name,
        value: form.type !== 'file' ? form.value.toString() : undefined,
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

  item.events.add(Events.getTests(endpoint, content, status, test));

  return item;
}

function defaultVal (parameter) {
  if (parameter.in === 'body') return { 'application/json:': jsf.generate(parameter.schema) };

  const type = parameter.items ? parameter.items.type : parameter.type;
  if (typeof type !== 'string') throw new TypeError('Type must be a string.');

  // Handle simple types (primitives and plain function/object)
  switch (type) {
  case 'boolean': return 'false';
  case 'integer':
  case 'number': return '0';
  case 'string': {
    // TODO: check format (date, date-time, enums, etc.)
    return 'string';
  }
  default : return '';
  }
}

module.exports = Endpoint;
