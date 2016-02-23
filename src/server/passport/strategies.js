const debug = require('debug')('60plus:passport-init');
import { Strategy } from 'passport-local';
//import Models from '../models/_all.js';
import bCrypt from 'bcrypt-node';
import jwt from 'jwt-simple';
import rwg from 'random-word-generator';

var generator = new rwg();


function create_strategies(passport) {

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, dßone) => {
    done(null, user);
  });


  // Regular local Login strategy for Web + API

  passport.use(new Strategy(
    function (username, password, done) {
      //Models.User.where('username', username).fetch().then(function (user) {
      //  if (user === null) return done(null, false);
      //  return done(null, user);
      //});
      return done(null, {username: username});
    }
  ));


  passport.use('create_user', new Strategy({
    usernameField: 'username',
    passwordField: 'language',
    passReqToCallback: true
  }, function (req, username, language, done) {

    username = generator.generate();

    let userObject = {
      username,
      "password": createHash('no_password')
    };

    debug('HELLO', username);

    //var newUser = new Models.User(userObject);
    //newUser.save();
    return done(null, {username});
  }));

  var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  };

  var isValidPassword = function (submitted_pw, database_pw) {
    return bCrypt.compareSync(submitted_pw, database_pw);
  };
}

export default create_strategies;

