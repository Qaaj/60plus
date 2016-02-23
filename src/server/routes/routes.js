const debug = require('debug')('60plus:routes');
//import Models from './models/_all.js';
import express from 'express';

import user from '../controllers/UserController.js';
import {isAuthenticated} from '../controllers/Authentication.js';

export function setupRoutes(app, passport) {

  const router = express.Router();

  // What happens when the user logs in using the API
  router.post('/api/user/login', user.login);

  // Create a random user using the API
  router.post('/api/user/create', user.create);

  // API routes (REST)

  //router.route('/api/user/:id').get(isAuthenticated, user.show);

  // INDEX route

  router.get('/', (req, res) => {
    res.render('index');
  });

  app.use('/', router);

}

