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

  it('Fail on GET whitout correct response 2XX', done => {
    swaggerTests(`${__dirname}/swaggers/GET-whitout-response-2XX-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 5001)) { done(); return; }

        done(error);
      });
  });

  it('Fail on GET whitout consumes', done => {
    swaggerTests(`${__dirname}/swaggers/GET-whitout-consumes-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 8001)) { done(); return; }
        done(error);
      });
  });

  it('Fail on GET security whitout response 401', done => {
    swaggerTests(`${__dirname}/swaggers/GET-whitout-response-401-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 6001)) { done(); return; }
        done(error);
      });
  });

  it('Fail on enum parameter whitout response 400', done => {
    swaggerTests(`${__dirname}/swaggers/parameter-enum-response-400-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 7002)) { done(); return; }
        done(error);
      });
  });

  it('Fail on not string parameter whitout response 400', done => {
    swaggerTests(`${__dirname}/swaggers/parameter-not-string-response-400-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 7003)) { done(); return; }
        done(error);
      });
  });

  it('Fail on parameter required whitout response 404', done => {
    swaggerTests(`${__dirname}/swaggers/parameter-required-response-404-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 7001)) { done(); return; }
        done(error);
      });
  });

  it('Ok on parameter required with ignore 404', done => {
    swaggerTests(`${__dirname}/swaggers/parameter-required-ignore-404-swagger.yaml`)
      .then(() => done())
      .catch(error => done(error));
  });

  it('GET ok with warning on parameter required', done => {
    swaggerTests(`${__dirname}/swaggers/GET-ok-swagger.yaml`)
      .then(result => {
        if (result.tests.definition.some(result => result.code === 4000) &&
          !result.tests.definition.some(result => result.code >= 5000)) {
          done();
          return;
        };

        done(new Error('Test fail'));
      })
      .catch(error => done(error));
  });

  it('Methods not implemented', done => {
    swaggerTests(`${__dirname}/swaggers/not-implemented-swagger.yaml`)
      .then(() => done())
      .catch(error => done(error));
  });

  it('Fail on POST whitout correct response 2XX', done => {
    swaggerTests(`${__dirname}/swaggers/POST-whitout-response-2XX-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 5003)) { done(); return; }

        done(error);
      });
  });

  it('Fail on POST whitout correct response 400', done => {
    swaggerTests(`${__dirname}/swaggers/POST-whitout-response-400-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 5002)) { done(); return; }

        done(error);
      });
  });

  it('POST ok', done => {
    swaggerTests(`${__dirname}/swaggers/POST-ok-swagger.yaml`)
      .then(() => done())
      .catch(error => done(error));
  });

  it('Fail on PUT whitout correct response 2XX', done => {
    swaggerTests(`${__dirname}/swaggers/PUT-whitout-response-2XX-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 5005)) { done(); return; }

        done(error);
      });
  });

  it('Fail on PUT whitout correct response 400', done => {
    swaggerTests(`${__dirname}/swaggers/PUT-whitout-response-400-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 5004)) { done(); return; }

        done(error);
      });
  });

  it('PUT ok', done => {
    swaggerTests(`${__dirname}/swaggers/PUT-ok-swagger.yaml`)
      .then(() => done())
      .catch(error => done(error));
  });

  it('Fail on PATCH whitout correct response 2XX', done => {
    swaggerTests(`${__dirname}/swaggers/PATCH-whitout-response-2XX-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 5007)) { done(); return; }

        done(error);
      });
  });

  it('Fail on PATCH whitout correct response 400', done => {
    swaggerTests(`${__dirname}/swaggers/PATCH-whitout-response-400-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 5006)) { done(); return; }

        done(error);
      });
  });

  it('PATCH ok', done => {
    swaggerTests(`${__dirname}/swaggers/PATCH-ok-swagger.yaml`)
      .then(() => done())
      .catch(error => done(error));
  });

  it('Fail on DELETE whitout correct response 2XX', done => {
    swaggerTests(`${__dirname}/swaggers/DELETE-whitout-response-2XX-swagger.yaml`)
      .then(() => done(new Error('Test fail')))
      .catch(error => {
        if (error.name === 'DefinitionError' &&
        error.results.some(result => result.code === 5008)) { done(); return; }

        done(error);
      });
  });

  it('DELETE ok', done => {
    swaggerTests(`${__dirname}/swaggers/DELETE-ok-swagger.yaml`)
      .then(() => done())
      .catch(error => done(error));
  });

  it('Pet Store run all', done => {
    swaggerTests(`${__dirname}/petstore-swagger.yaml`, {
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
