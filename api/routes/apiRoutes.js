'use strict';
module.exports = function (app) {
    var user = require('../controllers/userController'),
        room = require('../controllers/roomController'),
        privatechat = require('../controllers//privateChatController'),
        message = require('../controllers/messageController'),
        app = require('../../server'),     
        jwt = require('jsonwebtoken');

    app.route('/login')
        .post(user.login);

    app.route('/register')
        .post(user.create_user);

    
    //Add specific permisions per token
    app.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['chat-access-token'] || req.session.user.temporaryToken;
        //console.log(JSON.stringify(req.headers));
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
    app.route('/logout')
        .get(user.logout);

    app.route('/verify')
        .get(user.verify);

    app.route('/users')
        .get(user.list_all_users)
        .post(user.search_for_user);

    app.route('/users/:_id/profile')
        .get(user.view_profile);

    app.route('/users/:_id/friends')
        .get(user.list_friends)
        .post(user.add_friend);

    app.route('/users/:_id/rooms')
        .get(room.list_rooms)
        .post(room.add_room);

    app.route('/rooms')
        .get(room.list_all_rooms);

    app.route('/rooms/:_id/users')
        .get(room.list_members)
        .post(room.add_member)
        .delete(room.remove_member);

    app.route('/rooms/:_id/messages')
        .get(room.get_specific_room)
        .post(room.send_message);

    app.route('/privatechats')  
        .get(privatechat.list_chats);
    
    app.route('/privatechats/:_id/messages')
        .get(privatechat.get_specific_chat)
        .post(privatechat.send_reply);

    app.route('/users/:_id/privatechats')
        .get(privatechat.get_chats)
        .post(privatechat.create_private_chat);
    
    app.route('/messages')
        .get(message.list_messages);

};