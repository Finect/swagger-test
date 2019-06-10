const jsonServer = require('json-server');
const app = jsonServer.create();
const router = jsonServer.router({});
const middlewares = jsonServer.defaults();
let server;

module.exports.run = callback => {
  app.use(middlewares);
  app.use(jsonServer.bodyParser);

  // Mocking any method in json server
  app.use((req, res, next) => {
    if (!req.headers.authorization && !req.headers['api_key']) return res.status(401).json();

    switch (req.method) {
    case 'PUT':
    case 'POST':
      if (Object.keys(req.body).length === 0) return res.status(400).json();
    }

    next();
  });

  app.use('/pet/findByStatus', (req, res, next) => {
    if (req.query.status === 'aaaaaa') return res.status(400).json({ code: 400 });
    if (req.query.status === 'sold') return res.status(404).json({ code: 404 });

    return res.status(200).json([ {
      id: 1845563262948980266,
      category: {
        id: 0,
        name: 'string'
      },
      name: 'doggie',
      photoUrls: [
        'string'
      ],
      tags: [{
        id: 0,
        name: 'string'
      }],
      status: 'sold'
    }, {
      id: -795,
      category: {
        id: -260,
        name: 'M3QLVBf-cA_3Pe-L'
      },
      name: 'doggie',
      photoUrls: [
        'tN7_0pAdG7xt8MgF',
        'KLd_rdWVb1QSowN_',
      ],
      tags: [{
        id: 864,
        name: 'luBi2v0vA56bQVhT'
      }, {
        id: -721,
        name: 'Z7jqlpVGpOzOaw9g'
      }],
      status: 'sold'
    }]);
  });

  app.use('/pet/:id', (req, res, next) => {
    if (Number(req.params.id) === 0) return res.status(404).json({ code: 404 });
    if (isNaN(Number(req.params.id))) return res.status(400).json({ code: 400 });

    if (req.method === 'GET') return res.status(200).json({ code: 200 });
    if (req.method === 'PUT') return res.status(200).json({});
    if (req.method === 'DELETE') return res.status(204).json();

    next();
  });

  app.use('/pet', (req, res, next) => {
    if (req.method === 'POST') return res.status(201).json({ code: 201, data: {} });
    next();
  });

  app.use(router);
  server = app.listen(3000, () => {
    callback();
  });
};

module.exports.stop = callback => {
  server.close(() => {
    callback();
  });
};
