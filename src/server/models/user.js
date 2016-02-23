import Models from './_all.js';
var uuid = require('node-uuid');
var Checkit = require('checkit');

var validationRules = new Checkit({
    email: ['email'],
    identifier: 'required',
});

module.exports = function(bookshelf){

  return bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,

    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('creating', function(model, attrs, options) {
        model.set("identifier", uuid.v4());
      });
    },
    serialize: function(request) {
      return {
        id: this.get('identifier'),
        email: this.get('email'),
        username: this.get('username'),
      };
    },
    initialize: function() {
      this.on('saving', this.validateSave);
    },
    validateSave: function() {
      return validationRules.run(this.attributes);
    },

  });
}
