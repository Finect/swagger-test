/// <reference path="../index.d.ts"/>

'use strict';

const request = require('request-promise-native');
const ps = require('postman-collection');
const Variable = require('postman-collection/lib').Variable;

const Endpoint = require('./endpoint');
const deinitionTests = require('./definition-test');
const DefinitionError = require('./errors').DefinitionError;

class Endpoints {
  /**
   *Creates an instance of Endpoints.
   * @param {*} swagger Definition
   * @param {*} globalVariables Global variables for test
   * @param {string} tokenUrl Url to get OAuth token
   * @memberof Endpoints
   */
  constructor (swagger, globalVariables, tokenUrl) {
    this.swagger = swagger;
    this.endpoints = [];
    this.globalVariables = globalVariables;
    this.tokenUrl = tokenUrl;
  }

  parse (path, methods) {
    Object.keys(methods).forEach(method => {
      if (method.startsWith('x-')) return;
      const def = methods[method];

      const swaggerCommons = {
        consumes: this.swagger.consumes,
        produces: this.swagger.produces,
        schemes: this.swagger.schemes
      };

      const endpoint = new Endpoint(method, path, def, swaggerCommons);
      if (endpoint) this.endpoints.push(endpoint);
    });
  }

  async export (onExportEndpoint) {
    const result = {
      collection: new ps.Collection({
        info: {
          name: this.swagger.info.title,
          version: this.swagger.info.version
        }
      }),
      tests: {
        definition: [],
        collection: []
      }
    };

    let securities;
    let security;
    const securityDefinitions = { securities: [] };
    Object.keys(this.swagger.securityDefinitions).forEach(sec => {
      securityDefinitions.securities.push(Object.assign({ key: sec }, this.swagger.securityDefinitions[sec]));
    });

    if (this.swagger.securityDefinitions) {
      const securityValues = this.globalVariables.filter(obj => {
        return obj.name === 'client_id' || obj.name === 'client_secret' ||
          obj.name === 'username' || obj.name === 'password';
      }) || [];

      securityDefinitions.value = securityValues.reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
      }, {});

      securities = await getSecurities(securityDefinitions, this.tokenUrl);

      if (this.swagger.security) {
        // Get first security key
        const key = Object.keys(this.swagger.security[0])[0];
        security = securities[key];

        if (security.variable) this.globalVariables.push(security.variable);
      }
    }

    /** @type {Array<DefinitionErrorDetail>} */
    let results = [];
    this.endpoints.forEach(endpoint => {
      if (this.swagger.securityDefinitions && endpoint.def.security) {
        const key = Object.keys(endpoint.def.security[0])[0];
        security = securities[key];

        if (security && security.variable &&
          !this.globalVariables.some(variable => variable.name === security.variable.name)) {
          this.globalVariables.push(security.variable);
        }
      }

      let members = endpoint.export(this.swagger['x-pm-test'], security);
      let folder;
      if (endpoint.def.tags && endpoint.def.tags.length > 0) {
        folder = result.collection.items.find(member => member.name === endpoint.def.tags[0], null);
        // @ts-ignore
        if (folder) folder.item = folder.item.concat(members);
        else members = { name: endpoint.def.tags[0], item: members };
      }

      // @ts-ignore
      if (!folder) result.collection.items.members = result.collection.items.members.concat(members);
      onExportEndpoint(endpoint.method + ': ' + endpoint.url);

      // Test definition results
      results = results.concat(deinitionTests
        .definitionTestsPassed(endpoint, this.swagger.security || endpoint.def.security));
    });

    if (results.length > 0 && results.some(result => result.code >= 5000)) {
      throw new DefinitionError('Tests definition fails.', results);
    }

    result.tests.definition = results;

    this.globalVariables.forEach(variable => {
      if (variable.name === 'base-url') {
        result.collection.variables.add(new Variable({
          key: 'base-url',
          id: 'base-url',
          value: variable.value + this.swagger.basePath,
          type: 'string'
        }));

        return;
      }

      result.collection.variables.add(new Variable({
        key: variable.name,
        id: variable.name,
        value: variable.value,
        type: 'string'
      }));
    });

    if (!this.globalVariables.some(variable => variable.name === 'base-url')) {
      result.collection.variables.add(new Variable({
        key: 'base-url',
        id: 'base-url',
        value: this.swagger.schemes[0] + '://' + this.swagger.host + this.swagger.basePath,
        type: 'string'
      }));
    }

    return result;
  }
}

async function getSecurities (securityDef, tokenUrl) {
  const security = {};

  // only support password flow
  const oauth = securityDef.securities.filter(security => security.type === 'oauth2');
  for (const oauth2 of oauth) {
    switch (oauth2.flow) {
    case 'password':
      const b = Buffer.from(securityDef.value.client_id + ':' + securityDef.value.client_secret);

      const authRequest = {
        url: tokenUrl || oauth2.tokenUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + b.toString('base64')
        },
        form: {
          grant_type: security.flow,
          scope: Object.keys(oauth2.scopes).join(','),
          username: securityDef.value.username,
          password: securityDef.value.password
        }
      };

      try {
        const response = await request.post(authRequest);
        const result = JSON.parse(response);
        security[oauth2.key] = {
          param: {
            in: 'header',
            name: 'Authorization',
            value: `{{authorization}}`
          },
          variable: {
            name: 'authorization',
            value: result.token_type + ' ' + result.access_token
          }
        };
      } catch (error) {
        process.stdout.write(error);
      }

      break;
    default:
      security[oauth2.key] = {
        param: {
          in: 'header',
          name: 'Authorization',
          value: `{{authorization}}`
        },
        variable: {
          name: 'authorization',
          value: 'unsupported'
        }
      };
    }
  };

  securityDef.securities.filter(security => security.type === 'basic')
    .forEach(basic => {
      const b = Buffer.from(securityDef.value.client_id + ':' + securityDef.value.client_secret);

      security[basic.key] = {
        param: {
          in: 'header',
          name: 'Authorization',
          value: `{{${basic.name}}}`
        },
        variable: {
          name: basic.name,
          value: 'Basic ' + b.toString('base64')
        }
      };
    });

  securityDef.securities.filter(security => security.type === 'apiKey')
    .forEach(apiKey => {
      security[apiKey.key] = {
        param: {
          in: apiKey.in,
          name: apiKey.name,
          value: `{{${apiKey.name}}}`
        }
      };
    });

  return security;
}

module.exports = Endpoints;
