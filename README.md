# Definition-driven swagger REST API testing
[![Build Status](https://travis-ci.org/Finect/swagger-test.svg?branch=develop)](https://travis-ci.org/Finect/swagger-test) [![Coverage Status](https://coveralls.io/repos/github/Finect/swagger-test/badge.svg?branch=develop)](https://coveralls.io/github/Finect/swagger-test?branch=develop)


## Special thank you
To [Marco Antonio Sanz](https://twitter.com/marantonio82) and [CloudAppi](https://www.cloudappi.net/en_US/page/homepage) for the whole idea.

## Why definition test?
Becouse API-First definition, is better with test

- Do you have security in operations? Your response should be contain 401 (unauthorized)!
- Do you have GET operation? You should be contain consumes (accept) definition.
- Do you have any param in PATH? Your response should be contain 404 (not found)!
- Do you have POST/PUT/PATCH operation? Your response should be contain 400 (bad request)!

These are just some of the many test included in this tool.

## Postman
Create postman collection from swagger and test your endpoints.
- [Postman collection SDK](https://www.npmjs.com/package/postman-collection)
- [Newman - the cli companion for postman](https://www.npmjs.com/package/newman)

## Testing directly in... Swagger!
Vendor extensions for test (These can be specified for any response, except `default`.)

```
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


| object &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | description | required |
| ----------- | ----------- | -------- |
| x-pm-test | Tests array | false |
| x-pm-test.description | Description by test (request) | false |
| x-pm-test.params | Params array to use in each test | false |
| x-pm-test.params.name | Param name. | true |
| x-pm-test.params.in | The location of the parameter. Possible values are "query", "header", "path", "formData" or "body*". | true |
| x-pm-test.params.value | The value of the parameter used in request. | true |

For cases where any explicit test are be specified, they are inferred directly from the Swagger operation's specification..

For **body** you can write raw content to specify content (application/json).

```
201:
  description: New pet created
  x-pm-test:
  - params:
    - in: body
      application/json: {
        "id": 0,
        "category": {
          "id": 0,
          "name": "string"
        },
        "name": "doggie",
        "photoUrls": [
          "string"
        ],
        "tags": [
          {
            "id": 0,
            "name": "string"
          }
        ],
        "status": "available"
      }
```

By default, the following test are included:

1. Content type response (content-type) should be defined in `consumes`.
2. Http status response, should be defined in `responses`.

Additionally, you can inclide more tests using plugins.

1. isArray: Check if specific response property is an array
2. isObject: Check if specific response property is an object
3. valueCheck: Check if specific response property has specific value.

```
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
    plugins:
      - name: valueCheck
        params:
          item: 'code'
          value: 200
      - name: isArray
        params:
          item: 'data'
```

## Global test
You can define global test in swagger for all paths and all responses, except to... :-)

```
x-pm-test:
  tests:
    - raw: |
        var body = JSON.parse(responseBody);
        tests['Internal code response is ok'] = body.code === pm.response.code;
      except:
        responses:
          - 201
          - 401
        methods:
          - delete
```

### Why `x-pm-test-ignore404`
You decide. If do you have a GET that return an array object, what do you prefer, return empty array or 404 response.

- empty array?: use `x-pm-test-ignore404` in GET definition
- 404?: don't use `x-pm-test-ignore404`.


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

TODO:
1. Refactoring
2. Clean code
3. Use external plugins
4. More defaults definition test
5. More defaults integration test
6. Better documentation


