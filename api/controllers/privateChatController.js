'use strict';

var mongoose = require('mongoose');
var Chat = require('../models/privateChatModel');

exports.list_chats = function(req, res){
    Chat.find({},function(err, cht){
        if(err)
            res.send(err);
        res.json(cht);
    });
};

exports.create_private_chat = function(req, res){
    var new_Chat = new Chat(req.body);
    new_Chat.save(function(err, cht){
        if(err)
            res.send(err);
        res.json(cht);
    })
};