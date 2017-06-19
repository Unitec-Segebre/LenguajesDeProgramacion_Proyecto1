'use strict';
<<<<<<< HEAD
module.exports = function (app) {
    var user = require('../controllers/userController'),
        message = require('../controllers/messageController'),
        privatechat = require('../controllers/privateChatController'),
        helper = require('/Users/Francis/Desktop/LenguajesDeProgramacion_Proyecto1/helpers.js'), //change this later
        app = require('../../server'),
        jwt = require('jsonwebtoken');

    /*  ---------- AUTHENTICATION ROUTES ---------- */

    app.route('/login')
        .post(user.login);

    app.route('/register')
        .post(user.create_user)
        .get(user.list_all_users);
=======
module.exports = function(app) {
  var user = require('../controllers/userController'),
      room = require('../controllers/roomController'),
      app = require('../../server'),
      jwt = require('jsonwebtoken');

  app.route('/login')
      .post(user.login);

  app.route('/users')
      .post(user.create_user);

  //Add specific permisions per token
  app.use(function (req, res, next) {
      var token = req.body.token || req.query.token || req.headers['chat-access-token'];
      //console.log(JSON.stringify(req.headers));
      if(token){
          jwt.verify(token, app.get('superSecret'), function (err, decoded) {
              if(err)
                  return res.json({
                      success: false,
                      message: "Failed to authenticate token!"
                  });
              else{
                  req.decoded = decoded;
                  next();
              }
          });
      }else
          return res.json({
              success: false,
              message: "No token provided!"
          });
  });

  app.route('/users')
    .get(user.list_all_users);

  app.route('/users/:_id/friends')
      .get(user.list_friends)
      .post(user.add_friend);

  app.route('/users/:_id/rooms')
      .get(room.list_rooms)
      .post(room.add_room);

  app.route('/rooms/:_id/users')
      .get(room.list_members)
      .post(room.add_member)
      .delete(room.remove_member);
>>>>>>> master
    
    app.route('/verify')    // HAVE TO FIX THIS FUNCTION IN HELPERS.JS
        .get(helper.confirmProcess);

    /*  ---------- MIDDLEWARE ---------- */

    //Add specific permisions per token
    app.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['chat-access-token'];
        if (token) {
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err)
                    return res.json({
                        success: false,
                        message: "Failed to authenticate token!"
                    });
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else
            return res.json({
                success: false,
                message: "No token provided!"
            });
    });

    /* ------------ USER RELATED (POST LOGIN) ROUTES --------------- */

    app.route('/users')
        .get(user.list_all_users);

    /*app.route('/:userId')  
        .get(user.viewProfile);  */

     /* ------------ CHAT ROUTES --------------- */

    app.route('/privatechats')
        .get(privatechat.list_chats)
        .post(privatechat.create_private_chat);

    app.route('/messages')
        .get(message.list_messages)
        .post(message.write_message);


};