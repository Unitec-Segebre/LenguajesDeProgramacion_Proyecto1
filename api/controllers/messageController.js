'use strict';
var mongoose = require('mongoose');
var Message = mongoose.model('Messages');

exports.list_messages = function(req, res) {
  Message.find({}, function(err, mssg) {
    if (err)
      res.send(err);
    res.json(mssg);
  });
};

exports.write_message = function(req, res) {
  var new_mssg = new Message(req.body);
  new_mssg.save(function(err, mssg) {
    if (err)
      res.send(err);
    res.json(mssg);
  });
};