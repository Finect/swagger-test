# Definition-driven swagger REST API testing
[![Build Status](https://travis-ci.org/Finect/swagger-test.svg?branch=develop)](https://travis-ci.org/Finect/swagger-test) [![Coverage Status](https://coveralls.io/repos/github/Finect/swagger-test/badge.svg?branch=develop)](https://coveralls.io/github/Finect/swagger-test?branch=develop)


## Special thank you
To [Marco Antonio Sanz](https://twitter.com/marantonio82) and [CloudAppi](https://www.cloudappi.net/en_US/page/homepage) for the whole idea.

## Why definition test?
Becouse API-First definition, is better with test

```
Testing endpoints definition
→ post: /pet
√  Should be contain (400) response.
√  Should be contain (200,201,202,204,206) response.
√  Should be contain produces (content-type) definition.
√  Security definition, should be contain (401) response.
→ get: /pet/findByStatus
√  Should be contain (200,202,206) response.
√  Parameters required in PATH or QUERY, should be contain not found (404) response.
√  Parameter distint of type string, in PATH or QUERY, should be contain bad request (400) response.
√  Parameters required in QUERY, maybe should be change to 'in: path' definition.
√  Enum parameters in PATH or QUERY, should be contain bad request (400) response.
√  Query string parameter [status] should be lower case.
√  Should be contain consumes (accept) definition.
√  Security definition, should be contain (401) response.
→ get: /pet/{petId}
√  Should be contain (200,202,206) response.
√  Parameters required in PATH or QUERY, should be contain not found (404) response.
√  Parameter distint of type string, in PATH or QUERY, should be contain bad request (400) response.
√  Should be contain consumes (accept) definition.
√  Security definition, should be contain (401) response.
→ put: /pet/{petId}
√  Should be contain (400) response.
√  Should be contain (200,202,204,206) response.
√  Parameters required in PATH or QUERY, should be contain not found (404) response.
√  Parameter distint of type string, in PATH or QUERY, should be contain bad request (400) response.
√  Should be contain produces (content-type) definition.
√  Security definition, should be contain (401) response.
→ delete: /pet/{petId}
√  Should be contain (200,202,204) response.
√  Parameters required in PATH or QUERY, should be contain not found (404) response.
√  Parameter distint of type string, in PATH or QUERY, should be contain bad request (400) response.
√  Should be contain produces (content-type) definition.
√  Security definition, should be contain (401) response.
```

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
```
Swagger Petstore

□ pet
└ [201] on /pet
  POST http://localhost:3000/pet  POST /pet 201 32.001 ms - 31
[201 Created, 375B, 124ms]
  √  Content-Type is present
  √  Status code is 201
  √  code is 201
  √  data is object

└ ['400'] on /pet
  POST http://localhost:3000/pet  POST /pet 400 0.493 ms - -
[400 Bad Request, 314B, 7ms]
  √  Content-Type is present
  √  Status code is 400

└ ['401'] on /pet
  POST http://localhost:3000/pet  POST /pet 401 0.398 ms - -
[401 Unauthorized, 315B, 6ms]
  √  Content-Type is present
  √  Status code is 401

└ [200] on /pet/findByStatus
  GET http://localhost:3000/pet/findByStatus?status=available  GET /pet/findByStatus?status=available 200 0.541 ms - 31
[200 OK, 370B, 10ms]
  √  Content-Type is present
  √  Status code is 200
  √  code is 200
  √  data is array

└ [400] on /pet/findByStatus
  GET http://localhost:3000/pet/findByStatus?status=aaaaaa  GET /pet/findByStatus?status=aaaaaa 400 0.268 ms - 17
[400 Bad Request, 365B, 5ms]
  √  Content-Type is present
  √  Status code is 400

└ ['401'] on /pet/findByStatus
  GET http://localhost:3000/pet/findByStatus?status=string  GET /pet/findByStatus?status=string 401 0.163 ms - -
[401 Unauthorized, 315B, 6ms]
  √  Content-Type is present
  √  Status code is 401

└ [404] on /pet/findByStatus
  GET http://localhost:3000/pet/findByStatus?status=sold  GET /pet/findByStatus?status=sold 404 0.169 ms - 17
[404 Not Found, 363B, 6ms]
  √  Content-Type is present
  √  Status code is 404

└ [200] on /pet/:petId
  GET http://localhost:3000/pet/1  GET /pet/1 200 0.450 ms - 17
[200 OK, 356B, 5ms]
  √  Content-Type is present
  √  Status code is 200

└ [400] on /pet/:petId
  GET http://localhost:3000/pet/aaaaaa  GET /pet/aaaaaa 400 0.196 ms - 17
[400 Bad Request, 365B, 5ms]
  √  Content-Type is present
  √  Status code is 400

└ ['401'] on /pet/{petId}
  GET http://localhost:3000/pet/0  GET /pet/0 401 0.083 ms - -
[401 Unauthorized, 315B, 6ms]
  √  Content-Type is present
  √  Status code is 401

└ ['404'] on /pet/{petId}
  GET http://localhost:3000/pet/0  GET /pet/0 404 0.197 ms - 17
[404 Not Found, 363B, 5ms]
  √  Content-Type is present
  √  Status code is 404

└ [200] on /pet/:petId
  PUT http://localhost:3000/pet/1  PUT /pet/1 200 0.341 ms - 2
[200 OK, 339B, 4ms]
  √  Content-Type is present
  √  Status code is 200

└ [400] on /pet/:petId
  PUT http://localhost:3000/pet/aaaaaa  PUT /pet/aaaaaa 400 0.188 ms - -
[400 Bad Request, 314B, 4ms]
  √  Content-Type is present
  √  Status code is 400

└ ['401'] on /pet/{petId}
  PUT http://localhost:3000/pet/0  PUT /pet/0 401 0.179 ms - -
[401 Unauthorized, 315B, 5ms]
  √  Content-Type is present
  √  Status code is 401

└ [404] on /pet/:petId
  PUT http://localhost:3000/pet/0  PUT /pet/0 404 0.343 ms - 17
[404 Not Found, 363B, 4ms]
  √  Content-Type is present
  √  Status code is 404

└ [204] on /pet/:petId
  DELETE http://localhost:3000/pet/1  DELETE /pet/1 204 0.363 ms - -
[204 No Content, 221B, 4ms]
  √  Body is empty
  √  Status code is 204

└ [400] on /pet/:petId
  DELETE http://localhost:3000/pet/aaaaaa  DELETE /pet/aaaaaa 400 0.279 ms - 17
[400 Bad Request, 365B, 4ms]
  √  Content-Type is present
  √  Status code is 400

└ ['401'] on /pet/{petId}
  DELETE http://localhost:3000/pet/0  DELETE /pet/0 401 0.181 ms - -
[401 Unauthorized, 315B, 5ms]
  √  Content-Type is present
  √  Status code is 401

└ ['404'] on /pet/{petId}
  DELETE http://localhost:3000/pet/0  DELETE /pet/0 404 0.293 ms - 17
[404 Not Found, 363B, 9ms]
  √  Content-Type is present
  √  Status code is 404

┌─────────────────────────┬───────────────────┬──────────────────┐
│                         │          executed │           failed │
├─────────────────────────┼───────────────────┼──────────────────┤
│              iterations │                 1 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│                requests │                19 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│            test-scripts │                19 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│      prerequest-scripts │                 0 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│              assertions │                42 │                0 │
├─────────────────────────┴───────────────────┴──────────────────┤
│ total run duration: 848ms                                      │
├────────────────────────────────────────────────────────────────┤
│ total data received: 200B (approx)                             │
├────────────────────────────────────────────────────────────────┤
│ average response time: 11ms [min: 4ms, max: 124ms, s.d.: 26ms] │
└────────────────────────────────────────────────────────────────┘
collection run complete!
```
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
6. Support Swagger 3.0 (Aka. Open API)
6. Better documentation


