/*eslint node/no-unpublished-require:0*/

const jsonServer = require('json-server');
const app = jsonServer.create();
const router = jsonServer.router({});
const middlewares = jsonServer.defaults();
let server;

const swaggerTests = require('../src/swagger');

describe('Swagger definition to Postman test', () => {
  before(done => {
    //
    done();
  });

  before(done => {
    app.use(middlewares);
    app.use(router);
    server = app.listen(3000, () => {
      console.log('JSON Server is running');
      done();
    });
  });

  it('I can run all integration test', done => {
    swaggerTests('./test/petstore-swagger.yaml', {
      run: `./test/data.json`,
      save: true
    }).then(() => done())
      .catch(error => done(error));       
  });

  after(done => {
    server.close(() => {
      done();
    });
  });
});
