'use strict';
//Format errors

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    app = require('../../server'),
    nodemailer = require('nodemailer'),
    helper = require('/Users/Francis/Desktop/LenguajesDeProgramacion_Proyecto1/helpers.js'),//change this later
    config = require('/Users/Francis/Desktop/LenguajesDeProgramacion_Proyecto1/config.js'),//change this later
    User = mongoose.model('Users');

exports.list_all_users = function (req, res) {
    User.find({}, function (err, user) {
        if (err)
            return res.send(err);
        return res.json(user);
    });
};

exports.create_user = function (req, res) {
    var new_user = new User(req.body);
    new_user.save(function (err, user) {
        if (err)
            return res.send(err);
        else {
            var token = jwt.sign(user, app.get('superSecret'), {
                expiresIn: 60 * 60 * 24
            });

            /* ---------- CONFIRMATION EMAIL STUFF ------- */ 
             helper.sendConfirmationEmail(token,req,res);

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
        if (err)
            return res.send(err);

        if (!user) {
            return res.json({
                success: false,
                message: "Authentication failed: User not found."
            });
        } else if (user) {
            if (user.loginAttemptCount >= 5) {
                //Send Mailer
                return res.json({
                    success: false,
                    message: "Authentication failed: Max attempts reached."
                });
            } else {
                if (user.password !== req.body.password) {
                    user.loginAttemptCount += 1;
                    user.save(function (err, user) {
                        if (!err) {
                            return res.json({
                                success: false,
                                message: "Authentication failed: Wrong Password."
                            });
                        } else return res.send(err);
                    });
                } else {
                    user.loginAttemptCount = 0;
                    //is active for online stuff?
                    user.save(function (err, user) {
                        if (err)
                            return res.send(err);
                    });

                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 60 * 60 * 24
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

/*
exports.viewProfile = function (req, res, next) { //gotta work on this one

};*/