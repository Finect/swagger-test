/*eslint node/no-unpublished-require:0*/

const server = require('./server');
const swaggerTests = require('../src/swagger');

describe('Swagger definition to Postman test', () => {
  before(done => {
    server.run(() => {
      console.log('JSON Server is running');
      done();
    });
  });

  it('Pet Store run all', done => {
    swaggerTests(`${__dirname}/swaggers/petstore-swagger.yaml`, {
      run: true
    }).then(() => done())
      .catch(error => done(error));
  });

  after(done => {
    server.stop(() => {
      done();
    });
  });
});
