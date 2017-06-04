'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('Users');

exports.list_all_users = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.create_user = function(req, res) {
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.login = function (req, res) {
    User.findOne({username: req.body.username}, function (err, user) {
        if(err)
          res.send(err);

        if(user.loginAttemptCount >= 5){
          //Send Mailer
        }else{
          if(req.body.password === user.password){
            user.loginAttemptCount = 0;
              user.save(function(err, user) {
                if (err)
                  res.send(err);
                res.json(user);
              });
          }else {
            user.loginAttemptCount++;
            user.save(function(err, user) {
              if (err)
                res.send(err);
              res.send("Wrong Password!")
            });
          }
        }
    })
};