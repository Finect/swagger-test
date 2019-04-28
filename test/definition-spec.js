/*eslint node/no-unpublished-require:0*/

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router({});
const middlewares = jsonServer.defaults();

const swaggerTests = require('../src/swagger');

describe('Swagger definition to Postman test', () => {
  before(done => {
    //
    done();
  });

  before(done => {
    server.use(middlewares);
    server.use(router);
    server.listen(3000, () => {
      console.log('JSON Server is running');
      done();
    });
  });

  it('I can run all integration test', async done => {
    try {
      await swaggerTests('./test/petstore-swagger.yaml', {
        run: `./test/data.json`,
        save: true
      });       
      done();
    } catch (error) {
      console.log(error);
      done(error);            
    }
  });

  after(done => {
    done();
  });
});
