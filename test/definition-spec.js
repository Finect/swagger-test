/*eslint node/no-unpublished-require:0*/

const server = require('./server');
const swaggerTests = require('../src/swagger');

describe('Swagger definition to Postman test', () => {
  before(done => {
    //
    done();
  });

  before(done => {
    server.run(() => {
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
    server.stop(() => {
      done();
    });
  });
});
