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

    return res.status(200).json({ code: 200, data: [] });
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
