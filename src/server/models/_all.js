const Models = {

  init(bookshelf){

    this.User = require('./user')(bookshelf);

  }

}

module.exports = Models;

