'use strict';

var mongoose = require('mongoose'),
    Message = require('../models/messageModel'),
    //Message = require('../models/messageModel'),
    User = require('../models/userModel');

//functions below are just for testing

exports.list_messages = function (req, res) {
    Message.find({}, function (err, cht) {
        if (err)
            res.send(err);
        res.json(cht);
    });
};

exports.write_a_mssg = function (req, res) {
    var new_Mssg = new Message(req.body);
    new_Mssg.save(function (err, cht) {
        if (err)
            res.send(err);
        res.json(cht);
    })
};