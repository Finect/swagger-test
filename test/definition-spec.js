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
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 5001)) { done(); return; }

        done(error);
      });
  });

  it('Fail GET whitout consumes', done => {
    swaggerTests(`${__dirname}/swaggers/GET-whitout-consumes-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 8001)) { done(); return; }
        done(error);
      });
  });

  it('Fail GET security whitout response 401', done => {
    swaggerTests(`${__dirname}/swaggers/GET-whitout-response-401-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 6001)) { done(); return; }
        done(error);
      });
  });

  it('Fail enum parameter whitout response 400', done => {
    swaggerTests(`${__dirname}/swaggers/parameter-enum-response-400-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 7002)) { done(); return; }
        done(error);
      });
  });

  it('Fail parameter required whitout response 404', done => {
    swaggerTests(`${__dirname}/swaggers/parameter-required-response-404-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 7001)) { done(); return; }
        done(error);
      });
  });

  it('Parameter required ignore 404', done => {
    swaggerTests(`${__dirname}/swaggers/parameter-required-ignore-404-swagger.yaml`)
      .then(() => done())
      .catch(error => done(error));
  });

  it('Warning on parameter required', done => {
    swaggerTests(`${__dirname}/swaggers/GET-ok-swagger.yaml`)
      .then(result => {
        if (result.tests.definition.some(result => result.code === 4000)) {
          done();
          return;
        };

        done(new Error('Test fail'));
      })
      .catch(error => done(error));
  });

  it('GET ok', done => {
    swaggerTests(`${__dirname}/swaggers/GET-ok-swagger.yaml`)
      .then(() => done())
      .catch(error => done(error));
  });

  after(done => {
    server.stop(() => {
      done();
    });
  });
});
