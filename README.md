# Definition-driven swagger REST API testing
[![Build Status](https://travis-ci.org/Finect/swagger-test.svg?branch=develop)](https://travis-ci.org/Finect/swagger-test)


## Breve historia
Una de las primeras y más importantes tareas dentro de un gobierno de APIs, es la guía de definición. En esta guía dejamos plasmado desde un inicio las buenas prácticas que se deben aplicar sobre nuestras APIs: parámetros, endpoints, respuestas, paginado, esquema de resultados, etc. Hace unos tres años, y al parecer cansado de repetir la misma charla siempre, [Marco Antonio Sanz](https://twitter.com/marantonio82) me comentó la necesidad de hacer un framework que permitiera revisar esta rarea de forma automática.

Bajo esa idea inicial, aunque un poco más ampliada, nace **swagger-test** una herramienta que permite revisar una API definida en Swagger 2.0 y que además nos permite generar una colección de Postman® con test que permiten chequear nuestra implementación.

## ¿Por qué test para la definición?
Aunque muchas veces usamos lenguajes de definición para nuestras APIs, no siempre lo hacemos de la forma correcta:

- Si un endpoint requiere seguridad ¿Definimos un 401 de respuesta?
- Si definimos un método GET ¿Definimos siempre el tipo de contenido que aceptamos en la respuesta?
- Si definimos un parámetro por PATH ¿Definimos un 404 de respuesta?
- Si definimos un método POST/PUT/PATCH ¿Definimos un 400 de respuesta?

Esos, entre otros, son algunos de los test que ejecuta esta herramienta sobre una definición usando Swagger 2.0.

## ¿Por qué postman?
Postman es una herramienta que ya de por sí permite la importación de un Swagger, pero importa o genera un endpoint por cada ruta definida. La colección importada deja fuera la posibilidad de tener un endpoint por cada tipo de respuesta definida, y a su vez, la posibilidad de probar los diferentes casos de uso que se pueden dar en las llamadas a nuestros endpoint.

## ¡Definiendo nuestro test... en Swagger!
Para definir nuestros test, hemos introducido en Swagger algunas [extensiones](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#vendorExtensions)

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
| x-pm-test | Array en el que se definen todos los test a ejecutar para cada response | false |
| x-pm-test.description | Descripcción usada para el test (request) | false |
| x-pm-test.params | Array en el que se definen los valores para cada parámetro | false |
| x-pm-test.params.name | The name of the parameter. Parameter names are case sensitive. | true |
| x-pm-test.params.in | The location of the parameter. Possible values are "query", "header", "path", "formData" or "body*". | true |
| x-pm-test.params.value | The value of the parameter used in request. | true |

En caso de no añadir ningún test, la herramienta intentará generar uno para cada response, con los datos declarados en los parámetros. El tipo `default` en la definición del response, es ignorado.

Para el tipo **body** se puede especificar un raw del contenido que se desea enviar como parámetro.

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

Por defecto, la herramienta incluye los siguientes test:

1. Que el content-type devuelto en el response, se corresponda con el `consumes` definido.
2. Que el http status code devuelto en el response, se corresponda con el http status code definido en el `responses`.

Adicionalmente, existen test definidos que pueden ser incluidos como plugins en la definición.

1. isArray: Permite comprobar que una determinada propiedad del response, es un array
2. isObject: Permite comprobar que una determinada propiedad del response, es un Object
3. valueCheck: Permite comprobar el valor de una determinada propiedad del response.

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


