'use strict';
//Format errors

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    app = require('../../server'),
    helper = require('./helpers'),
    User = mongoose.model('Users');

exports.list_all_users = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      return res.send(err);
    return res.json(user);
  });
};

exports.create_user = function(req, res) {
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err)
      return res.send(err);
    else{
        var token = jwt.sign(user, app.get('superSecret'),{
            expiresIn: 60*60*24
        });

       // helper.sendConfirmationEmail(token,req,res);

        return res.json({
            success: true,
            message: "Succesful sign up, here is your Token!",
            token: token
        });
    }
  });
};

exports.login = function (req, res) {

  User.findOne({
      username: req.body.username
  }, function (err, user) {
      if(err)
        return res.send(err);

      if(!user){
        return res.json({
            success: false,
            message: "Authentication failed: User not found."
        });
      }else if(user){
          if(user.loginAttemptCount >= 5) {
              //Send Mailer
              return res.json({
                  success: false,
                  message: "Authentication failed: Max attempts reached."
              });
          }else{
              if(user.password !== req.body.password){
                  user.loginAttemptCount += 1;
                  user.save(function(err, user) {
                      if (!err) {
                          return res.json({
                              success: false,
                              message: "Authentication failed: Wrong Password."
                          });
                      } else return res.send(err);
                  });
              }else{
                  user.loginAttemptCount = 0;
                  user.save(function(err, user) {
                    if (err)
                      return res.send(err);
                  });

                  var token = jwt.sign(user, app.get('superSecret'),{
                      expiresIn: 60*60*24
                  });

                  return res.json({
                      success: true,
                      message: "Enjoy your Token!",
                      token: token
                  });
              }
          }
      }
  });
};

exports.add_friend = function (req, res) { //Are friends both sides?
    User.findOne({
        _id: req.params._id
    }, function (err, user) {
        if(err)
            return res.send(err);
        if(user) {
            User.findOne({
                _id: req.body._id
            }, function (err, friend) {
                if (err)
                    return res.send(err);

                if(friend) {
                    user.friends.push(friend);
                    user.save(function (err) {
                        if (err)
                            return res.send(err);
                        return res.json({
                            success: true,
                            message: "Friend added succesfully."
                        });
                    });
                }else
                    return res.json({
                        success: false,
                        id: req.body._id,
                        message: "User does not exist."
                    });
            })
        }else
            res.send({"ERR": "Couldn't find user with id", "ID": req.params._id}) //change response
    })
};

exports.view_profile = function(req, res){
    User.findOne({ _id: req.params._id}, function(err, usr){
        if(err){
            res.send({success: false, message: "Could not find user."});
        }
        res.json(usr);
    });
}


exports.list_friends = function (req, res) {
    User.findOne({
        _id: req.params._id
    }).populate('friends').exec(function (err, user) {
        if(err)
            return res.send(err);
        res.json(user.friends);
    });
};