# Swagger for definition and REST API testing
[![Build Status](https://travis-ci.org/Finect/swagger-test.svg?branch=develop)](https://travis-ci.org/Finect/swagger-test) [![Coverage Status](https://coveralls.io/repos/github/Finect/swagger-test/badge.svg?branch=develop)](https://coveralls.io/github/Finect/swagger-test?branch=develop)


## Why definition test?
Becouse API-First definition, is better with test

- Do you have security in operations? Your response should be contain 401 (unauthorized)!
- Do you have GET operation? You should be contain consumes (accept) definition.
- Do you have any param in PATH? Your response should be contain 404 (not found)!
- Do you have POST/PUT/PATCH operation? Your response should be contain 400 (bad request)!

These are just some of the [many test](https://github.com/Finect/swagger-test/wiki/definition-tests) included in this tool.

## REST API testing directly in Swagger!

Vendor extension `x-pm-test` for test (These can be specified for any response, except `default`.)

```
responses:
  200:
    description: "successful operation"
    schema:
      type: "array"
      items:
        $ref: "#/definitions/Pet"
    x-pm-test:
    - params:
      - name: status
        in: query
        value: '{{status}}'
  400:
    description: "Invalid status value"
    x-pm-test:
      - params:
        - name: status
          in: query
          value: 'aaaaaa'
```

### `x-pm-test` object representation

- x-pm-test (array, optional) - Tests array.
    - description (string, optional) - Description used in postman endpoint name.
    - params (array, optional) - Define parameters values in test
        - name (string, required) - Param name. Required to all parameters, except body.
        - in (string, required) - The location of the parameter. Possible values are "query", "header", "path", "formData" or "body*".
        - value (string, required) - Value to fetch in parameter
    - plugins (array, optional)
        - name (string, required) - Plugin name to use
        - params (object) - Object to define parameters to plugin
    - raw (string, optional) - Define your custom postman test.

**YAML example**
```
x-pm-test:
- description: Get pets by status
  params:
  - name: status
    in: query
    value: '{{status}}'
  plugins:
    - name: valueCheck
      params:
        item: 'id'
        value: 0
    - name: isArray
      params:
        item: 'tags'
    - name: isObject
      params:
        item: 'category'
```

[Integration test on wiki](https://github.com/Finect/swagger-test/wiki/Integration-tests)

## Testing
```
$ npm install -g driven-swagger-test
$ driven-swagger-test
```

## Usage
```
const server = require('./server');
const swaggerTests = require('../src/swagger');

describe('Swagger definition to Postman test', () => {
  before(done => {
    server.run(() => {
      console.log('JSON Server is running');
      done();
    });
  });

  it.only('Pet Store run all', async () => {
    try {
      const results = await swaggerTests(`${__dirname}/swaggers/petstore-swagger.yaml`, {
        run: `${__dirname}/data.json`,
        save: true
      });

      console.assert(!results.tests.definition.some(result => result.code >= 5000), 'Errors in test.');
    } catch (error) { throw error; }
  });

  after(done => {
    server.stop(() => {
      done();
    });
  });
});
```

## Special thank you
To [Marco Antonio Sanz](https://twitter.com/marantonio82) and [CloudAppi](https://www.cloudappi.net/en_US/page/homepage) for the whole idea.


TODO:
1. Refactoring
2. Clean code
3. Use external plugins
4. More defaults definition test
5. More defaults integration test
6. Support Swagger 3.0 (Aka. Open API)
6. Better documentation


