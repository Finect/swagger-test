const jsonServer = require('json-server');
const app = jsonServer.create();
const router = jsonServer.router({});
const middlewares = jsonServer.defaults();
let server;

module.exports.run = callback => {
  app.use(middlewares);

  // Moking any method in json server
  // server.put('/products/*', (req, res, next) => { 
  //   if (req.body === undefined) { 
  //     res.sendStatus(400) 
  //   } else { 
  //     next(); 
  //   } 
  // });
   
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
