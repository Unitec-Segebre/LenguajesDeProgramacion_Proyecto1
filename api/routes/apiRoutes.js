'use strict';
module.exports = function(app) {
  var user = require('../controllers/userController');

  app.route('/login')
      .post(user.login);

  app.route('/users')
    .get(user.list_all_users)
    .post(user.create_user);
    
};