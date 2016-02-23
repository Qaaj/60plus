import jwt from 'jwt-simple';
const debug = require('debug')('60plus:routes');

export function isAuthenticated(req,res,next){

  if (req.isAuthenticated()) {
    return next();
  } else {
    if (req.headers.token) { // If not, is there a token in the header?

      try {
        var decoded = jwt.decode(req.headers.token,  req.app.get('config').TOKEN_PK);
      } catch (err) {
        debug('Authentication of token failed: ' + err);
        return res.status(401).send({error: 'Authentication of token failed'});
      }

      debug('Token decoded: ', decoded);
      let user = {username: decoded.username};

      req.user = user;
      next();

    } else {
      debug('No Auth: ' + err);
      res.status(401).send({error: "No Auth"})
    }
  }
}
