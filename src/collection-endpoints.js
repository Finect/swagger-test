'use strict';

const Endpoint = require('./endpoint');
const deinitionTests = require('./definition-test');

const request = require('request-promise-native');
const ps = require('postman-collection');

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
    this.globalVariables = globalVariables || [];
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
    const collection = new ps.Collection({
      info: {
        name: this.swagger.info.title,
        version: this.swagger.info.version
      }
    });

    let securities;
    let security;
    if (this.swagger.securityDefinitions) {
      const securityValues = this.globalVariables.filter(obj => {
        return obj.name === 'client_id' || obj.name === 'client_secret' || 
          obj.name === 'username' || obj.name === 'password';
      }) || [];

      this.swagger.securityDefinitions.value = securityValues.reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
      }, {});

      securities = await getSecurities(this.swagger.securityDefinitions, this.tokenUrl);

      if (this.swagger.security) {
        // Get first security key
        const key = Object.keys(this.swagger.security[0])[0];
        security = securities[key];

        if (security.variable) this.globalVariables.push(security.variable);
      }
    }

    let definitionTestsPassed = true;
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
        folder = collection.items.members.find(member => member.name === endpoint.def.tags[0]);
        if (folder) folder.item = folder.item.concat(members);
        else members = { name: endpoint.def.tags[0], item: members };
      }

      if (!folder) collection.items.members = collection.items.members.concat(members);
      onExportEndpoint(endpoint.method + ': ' + endpoint.url);

      // Test definition
      definitionTestsPassed = deinitionTests
        .definitionTestsPassed(endpoint, this.swagger.security) && definitionTestsPassed;
    });

    if (!definitionTestsPassed) {
      process.stdout.write('\nTests definition fails. Process aborted.\n');
      process.exit(100);
    }

    this.globalVariables.forEach(variable => {
      if (variable.name === 'base-url') {
        collection.variables.add({ 
          key: 'base-url', 
          id: 'base-url', 
          value: variable.value + this.swagger.basePath, 
          type: 'string' 
        });
        
        return;
      }
      
      collection.variables.add({ key: variable.name, id: variable.name, value: variable.value, type: 'string' });
    });

    if (this.globalVariables.some(variable => variable.name === 'base-url')) {
      collection.variables.add({ 
        key: 'base-url', 
        id: 'base-url', 
        value: this.swagger.schemes[0] + '://' + this.swagger.host + this.swagger.basePath, 
        type: 'string' 
      });
    } 

    return collection;
  }
}

async function getSecurities (securityDef, tokenUrl) {
  const security = {};

  if (securityDef.hasOwnProperty('oauth2') && securityDef.oauth2.flow === 'password') {
    const b = Buffer.from(securityDef.value.client_id + ':' + securityDef.value.client_secret);

    const authRequest = {
      url: tokenUrl || securityDef.oauth2.tokenUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + b.toString('base64')
      },
      form: {
        grant_type: 'password',
        scope: Object.keys(securityDef.oauth2.scopes).join(','),
        username: securityDef.value.username,
        password: securityDef.value.password
      }
    };
      
    try {
      const response = await request.post(authRequest);
      const result = JSON.parse(response);
      security.oauth2 = {
        param: {
          in: 'header',
          name: 'Authorization',
          value: '{{oauth2_token}}'
        },
        variable: {
          name: 'oauth2_token',
          value: result.token_type + ' ' + result.access_token 
        }
      };    
    } catch (error) { 
      process.stdout.write(error); 
    }
  }

  if (securityDef.hasOwnProperty('basicAuth')) {
    const b = Buffer.from(securityDef.value.client_id + ':' + securityDef.value.client_secret);

    security.basicAuth = {
      param: {
        in: 'header',
        name: 'Authorization',
        value: '{{basicAuth_token}}'
      },
      variable: {
        name: 'basicAuth_token',
        value: 'Basic ' + b.toString('base64') 
      }
    };
  }

  if (securityDef.hasOwnProperty('APIKeyHeader')) {
    security.APIKeyHeader = {
      param: {
        in: 'header',
        name: securityDef['APIKeyHeader'].name,
        value: '{{' + securityDef['APIKeyHeader'].name + '}}'                
      }
    };
  }

  if (securityDef.hasOwnProperty('APIKeyQueryParam')) {
    security.APIKeyQueryParam = {
      param: {
        in: 'query',
        name: securityDef['APIKeyHeader'].name,
        value: '{{' + securityDef['APIKeyHeader'].name + '}}'
      }
    };
  }

  if (securityDef.hasOwnProperty('Bearer')) {
    security.Bearer = {
      param: {
        in: 'header',
        name: securityDef['Bearer'].name,
        value: '{{' + securityDef['Bearer'].name + '}}'                
      }
    };
  }    

  return security;
}

module.exports = Endpoints;
