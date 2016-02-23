const debug = require('debug')('60plus:routes');
//import Models from './models/_all.js';

import express from 'express';
import jwt from 'jwt-simple';

export function setupRoutes(app, passport) {

  const router = express.Router();

  // What happens when the user logs in using the API

  router.post('/api/user/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {

      if (err) return res.status(401).send({error: err});

      if (!user) {
        if (err) return res.status(401).send({error: err});
        return res.status(401).send({error: 'Authentication failed'});
      }

      //user has authenticated correctly thus we create a JWT token
      var token = jwt.encode({username: req.body.username}, app.get('config').TOKEN_PK);
      res.json({token: token});

    })(req, res, next);
  });

  // Create a random user using the API

  router.post('/api/user/create', function (req, res, next) {
    passport.authenticate('create_user', function (err, user, info) {

      if (err) return res.status(401).send({error: err});

      if (!user) {
        if (err) return res.status(401).send({error: err});ß
        return res.status(401).send({error: 'Random user creation failed'});
      }

      //user has authenticated correctly thus we create a JWT token
      var token = jwt.encode({username: user.username}, app.get('config').TOKEN_PK);
      res.json({token: token, username: user.username});

    })(req, res, next);
  });

  var isAuthenticated = function (req, res, next) {

    return next();

    if (req.isAuthenticated()) {
      return next();
    } else {
      if (req.headers.token) { // If not, is there a token in the header?

        try {
          var decoded = jwt.decode(req.headers.token, app.locals.config.TOKEN_PK);
        } catch (err) {
          return res.status(401).send({error: 'Authentication of token failed'});
        }

        debug('Token decoded: ', decoded);
        let user = {username: decoded.username};

        req.user = user;
        next();

      } else {
        res.status(401).send({error: "Not authenticated"})
      }
    }
  }

  // API routes (REST)
  //
  //router.route('/api/users').post(user.create);
  //router.route('/api/users').get(isAuthenticated, user.index);
  //router.route('/api/user/:id').get(isAuthenticated, user.show);
  //router.route('/api/user/:id').delete(isAuthenticated, user.destroy);
  //router.route('/api/user/:id').put(isAuthenticated, user.update);
  //router.route('/api/user/token').post(isAuthenticated, user.addAmazonToken);
  //
  //router.route('/api/message/send').post(isAuthenticated, message.send);


  // INDEX route
  router.get('/', (req, res) => {
    //res.render('index');
    res.render('index');
  });

  app.use('/', router);

}

