const debug = require('debug')('60plus:start');

import express from 'express';
import http from 'http';
import os from 'os';
import cluster from 'cluster';
import bodyParser from 'body-parser';
import nconf from 'nconf';
import passport from 'passport';
import logger from 'morgan';
import path from 'path';
import express_session from 'express-session';

import create_strategies from './passport/strategies.js';
import { setupRoutes } from './routes/routes.js';


let app;
let httpServer;

// Get environment
const ENV = process.env.NODE_ENV || 'local';

// Load env options + global options + environment options
nconf
  .argv()
  .env()
  .file('global', __dirname + '/config/global.json')
  .file('environment', __dirname + '/config/' + ENV + '.json');


let config = nconf.get();

// Get num of available CPU's
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }
} else {

  debug("Launching express application on cluster with ID: " + cluster.worker.id);

  // Set up express app
  app = express();
  app.set('config', config);

  // Setup view engine and views folder
  app.set('views', path.join(__dirname, './views'));
  app.set('view engine', 'jade');

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Set up session handling
  app.use(express_session({
    secret: 'mySecretKey', resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  create_strategies(passport);

  setupRoutes(app, passport);

  // Middleware for logging api calls
  if (process.env.NODE_ENV !== 'production') {
    app.use(logger('dev'));
  }


  // Defines the cachebusting and right JS files for the view files.
  if (process.env.NODE_ENV === 'local') {
    app.locals.deployVersion = 0;
  } else {
    // Host the dist files
    app.use(express.static(path.join(__dirname, '../../dist')));
    app.locals.deployVersion = Math.ceil(new Date().getTime() / 300000) * 300000;
  }

  // Initialize the database connection with knex/bookshelf
  //if(config.DB_PW){
  //  config.database.connection.password = config.DB_PW;
  //}
  //var knex = require('knex')(config.database);
  //if (ENV !== 'local') {
  //  knex.migrate.latest(config.database);
  //}
  //var bookshelf = require('bookshelf')(knex);
  //
  //app.set('bookshelf', bookshelf);
  //
  //Models.init(bookshelf);

  // Start the server
  httpServer = http.createServer(app);
  httpServer.listen(3000);

}
