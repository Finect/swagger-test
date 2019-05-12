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

  it('Fail GET whitout correct response 200', done => {
    swaggerTests(`${__dirname}/swaggers/GET-whitout-response-200-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError') { done(); return; }
        done(error);
      });
  });

  it('Fail GET whitout consumes', done => {
    swaggerTests(`${__dirname}/swaggers/GET-whitout-consumes-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError') { done(); return; }
        done(error);
      });
  });

  it('Fail GET security whitout response 401', done => {
    swaggerTests(`${__dirname}/swaggers/GET-whitout-response-401-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError') { done(); return; }
        done(error);
      });
  });

  it('Warning on parameter required', done => {
    swaggerTests(`${__dirname}/swaggers/GET-ok-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError') { done(); return; }
        done(error);
      });
  });

  it('GET all ok', done => {
    swaggerTests(`${__dirname}/swaggers/GET-ok-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError') { done(); return; }
        done(error);
      });
  });

  after(done => {
    server.stop(() => {
      done();
    });
  });
});
