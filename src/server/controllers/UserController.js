const debug = require('debug')('60plus:UserController');

import bCrypt from 'bcrypt-node';
import jwt from 'jwt-simple';
import passport from 'passport';

var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};


function create(req, res, next) {
  passport.authenticate('create_user', function (err, user, info) {

    if (err) return res.status(401).send({error: err});
    if (!user) return res.status(401).send({error: 'Random user creation failed'});

    //user has authenticated correctly thus we create a JWT token
    var token = jwt.encode({username: user.username}, req.app.get('config').TOKEN_PK);
    res.json({token: token, username: user.username});

  })(req, res, next);
}

function login(req, res, next) {
  passport.authenticate('local', function (err, user, info) {

    if (err)  return res.status(401).send({error: err});
    if (!user) return res.status(401).send({error: 'Authentication failed'});

    //user has authenticated correctly thus we create a JWT token
    var token = jwt.encode({username: req.body.username}, req.app.get('config').TOKEN_PK);
    res.json({token: token});

  })(req, res, next);
}


module.exports = {create, login};
