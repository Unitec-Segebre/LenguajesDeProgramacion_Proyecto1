'use strict';

var mongoose = require('mongoose');
var Chat = require('../models/privateChatModel');
var Message = require('../models/messageModel');
var User = require('../models/userModel');

exports.list_chats = function (req, res) {
    Chat.find({}, function (err, cht) {
        if (err)
            res.send(err);
        res.json(cht);
    });
};

exports.create_private_chat = function (req, res) {
    var new_Chat = new Chat(req.body);
    new_Chat.save(function (err, cht) {
        if (err)
            res.send(err);
        res.json(cht);
    })
};
/*
exports.create_new_chat = function (req, res, next) {
    if (!req.params.recipient) {
        res.status(422).send({ error: 'Please choose a valid recipient for the message.' });
        return next();
    }
    if (!req.body.composedMessage) {
        res.status(422).send({ error: 'Please enter a message!' });
        return next();
    }

    const chateo = new Chat({
        otherUser: req.params.recipient
    });

    chateo.save(function (err, nChat) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        const mensaje = new Message({
            chatId: nChat._id,
            body: req.body.composedMessage,
            author: req.User._id
        });

        mensaje.save(function (err, newMessage) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }
            res.status(200).json({ message: 'New private chat started!', chatId: chateo._id });
            return next();
        });
    });
};

exports.get_chat = function (req, res, next) {
    Message.find({ chatId: req.params.chatId })
        .select('createdAt body author')
        .sort('-createdAt')
        .populate({
            path: 'author',
            select: 'name'
        })
        .exec(function (err, messages) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }
            res.status(200).json({ chat: messages });
        })
};

exports.send_Message = function (req, res, next) {
    const Mssg = new Message({
        chatId: req.params.chatId,
        body: req.body.composedMessage,
        author: req.User._id
    });

    Mssg.save(function (err, sentMessage) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }
        res.status(200).json({ message: 'Reply successfully sent!' });
        return next();
    })
}*/