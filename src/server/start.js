const debug = require('debug')('60plus:start');

import express from 'express';
import http from 'http';
import cluster from 'cluster';


let app;
let httpServer;

if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }
} else {

  // Bootstrap the express app

  debug("Launching express application on cluster with ID: " + cluster.worker.id);
  // Set up express app
  app = express();

  // Start the server
  httpServer = http.createServer(app);
  httpServer.listen(3000);

}
