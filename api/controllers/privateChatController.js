'use strict';

var mongoose = require('mongoose'),
    PrivateChat = require('../models/privateChatModel'),
    Message = require('../models/messageModel'),
    User = require('../models/userModel');

exports.list_chats = function (req, res) {
    PrivateChat.find({}, function (err, cht) {
        if (err)
            res.send(err);
        res.json(cht);
    });
};

exports.create_pchat = function (req, res) {
    var new_Chat = new PrivateChat(req.body);
    new_Chat.save(function (err, cht) {
        if (err)
            res.send(err);
        res.json(cht);
    })
};

exports.create_private_chat = function (req, res, next) { //must edit this to make sure null is covered
    if (!req.body.recipient) {
        res.send({ success: false, message: "Please choose with whom to start a chat with!" });
        return next();
    }

    if (!req.body.text) {
        res.send({ success: false, message: "Please write a message!" });
        return next();
    }

    User.findOne({ _id: req.params._id }, function (err, usr) {
        if (err) {
            res.send({ success: false, message: "Current User does not exist!" });
            return next();
        }

        var PChat = new PrivateChat({
            participants: [req.params._id, req.body.recipient]
        });

        PChat.save(function (err, newPchat) {
            if (err) {
                res.send({ success: false, message: "Chat couldn't be saved." });
                return next();
            }

            var mssg = new Message({
                chatId: newPchat._id,
                body: req.body.text,
                author: req.params._id
            });

            mssg.save(function (err) {
                if (err) {
                    res.send({ succes: false, message: "Message coudln't be stored in the database." })
                }
                usr.privateChats.push(newPchat);
                usr.save(function (err) {
                    if (err) {
                        res.send({ success: false, message: "Private chat couldn't be stored in the user's privatechats." });
                        return next();
                    }
                    User.findOne({ _id: req.body.recipient }, function (err, otherUser) {
                        if (err) {
                            res.send({ success: false, message: "Recipient couldn't be found!" });
                            return next();
                        }
                        otherUser.privateChats.push(newPchat);
                        otherUser.save(function (err) {
                            if (err) {
                                res.send({ success: false, message: "Private chat couldn't be saved in recipient's privatechats!" });
                                return next();
                            }
                            newPchat.messages.push(mssg);
                            newPchat.save(function (err) {
                                if (err) {
                                    res.send({ success: false, message: "Private chat couldn't be stored in the database." });
                                    return next();
                                }
                                res.send({
                                    success: true,
                                    message: "New private chat created!"
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

exports.send_reply = function (req, res, next) {

    if (!req.body.text) {
        res.send({ success: false, message: "Please write a message!" });
        return next();
    }

    if (!req.body.userId) {
        res.send({ success: false, message: "Backend must provide userId" });
        return next();
    }

    var reply = new Message({
        chatId: req.params._id,
        body: req.body.text,
        author: req.body.userId
    });

    PrivateChat.findOneAndUpdate({ _id: req.params._id },
        { $push: { "messages": reply } }, { returnOriginal: false }, function (err, pchat) {
            if (err) {
                res.send({ success: false, message: "Private chat couldn't be found!" });
                return next();
            }
            reply.save(function (err) {
                if (err) {
                    res.send({ success: false, message: "Reply couldn't be saved to the database!" });
                    return next();
                }
                res.send({ succes: true, message: "Reply successfully sent!" });
                return next();
        });
    });
}

exports.get_specific_chat = function (req, res, next) { //work on this
    PrivateChat.findOne({ _id: req.params._id }, function (err, pchat) {
        if (err) {
            res.send({ success: false, message: "Private chat couldn't be found!" });
            return next();
        }
        Message.find({ chatId: req.params._id })
            .select('createdAt body author')
            .sort('-createdAt')
            .populate({
                path: 'author',
                select: 'name'
            })
            .exec(function (err, messages) {
                if (err) {
                    res.send({ success: false, error: err });
                    return next();
                }
                res.status(200).json({ PrivateChat: messages });
            });
    });
}

exports.get_chats = function (req, res, next) {
    User.findOne({ _id: req.params._id }, function (err, usr) {
        if (err) {
            res.send({ succes: false, message: "Current User ID doesn't match any of the registered users." });
            return next();
        }
        if(typeof usr.privateChats !== 'undefined' && usr.privateChats.length > 0){
            PrivateChat.find({ participants: req.params._id })  //esto debe ser cambiado por un mejor
            .select('_id')
            .exec(function (err, pchats) {
                if (err) {
                    res.send({ success: false, message: "Private chat doesn't exist!", error: err });
                    return next();
                }

                let chatList = [];
                pchats.forEach(function (chat) {
                    Message.find({ chatId: chat._id })
                        .sort('-createdAt')
                        .limit(1)
                        .populate({
                            path: 'author',
                            select: 'name'
                        })
                        .exec(function (err, mssg) {
                            if (err) {
                                res.send({ success: false, error: err });
                                return next();
                            }
                            chatList.push(mssg);
                            if (chatList.length === pchats.length) {
                                return res.status(200).json({ conversations: chatList });
                            }
                        });
                });
            });
        }else{
            res.send({success: false, message: "User doesn't have any private chats!"});
        }
    });
}

exports.delete_chat = function (req, res, next) { // gotta work on this one
    User.findOne({_id: req.params._id}, function(err, usr){
        if(err){
            res.json(err);
        }
        User.update({_id: req.params._id},
            { $pull: {privateChats: req.body._id}}, 
            { returnOriginal: false},
            function (err) {
                if(err)
                    return res.send(err);
                res.send({ success: true, message: "Private chat removed from user1 array." });

                PrivateChat.findOneAndUpdate({ _id: req.body._id },
                    { $pull: { participants: usr._id } }, { returnOriginal: false }, function (err, pchat) {
                        if (err) {
                            res.send({ success: false, message: "Private chat couldn't be found!" });
                        }
                        console.log("User1 removed from pchat array");             
                });
        });  
    });
};

