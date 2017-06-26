'use strict';
//Format errors

var bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    app = require('../../server'),
    sgTransprt = require('nodemailer-sendgrid-transport'),
    config = require('./config'),
    User = mongoose.model('Users');


var options = {
    auth: {
        api_user: 'overchats',
        api_key: config.overPass
    }
}

exports.list_all_users = function (req, res) {
    User.find({}, function (err, user) {
        if (err)
            return res.send(err);
        return res.json(user);
    });
};

exports.create_user = function (req, res) {
    var new_user = new User();
    new_user.username = req.body.username;
    new_user.email = req.body.email;
    new_user.name = req.body.name;

    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            new_user.password = hash;
        });
    });

    var token = jwt.sign(new_user, app.get('superSecret'), { expiresIn: 60 * 60 * 24 });
    new_user.temporaryToken = token;

    var link = "http://" + req.get('host') + "/verify?token=" + new_user.temporaryToken;

    new_user.save(function (err, user) {
        if (err)
            return res.send(err);
        else {
            var client = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: 'overchats',
                    pass: config.overPass
                }
            });

            var email = {
                from: 'overchats@gmail.com',
                to: new_user.email,
                subject: 'Overchats Email Confirmation',
                text: "Welcome to Overchat! Hello! You recently registered to Overchat, under the username " + req.body.username + ". Please click the link below to confirm your email. If you have not used this email to register to Overchat, please ignore this. Click here to confirm.",
                html: "<p><h1>Welcome to Overchat!</h1></p><p>Hello! You recently registered to <b>Overchat</b>, under the username " + req.body.username + ". Please click the link below to confirm your email. If you have not used this email to register to Overchat, please ignore this.</p><br><a href=" + link + ">Click here to confirm.</a></br>"
            };

            client.sendMail(email, function (err, info) {
                if (err) {
                    console.log(error);
                }
                else {
                    console.log('Message sent: ' + info.response);
                }
            });

            return res.json({
                success: true,
                message: "Succesful sign up, here is your Token!",
                token: token
            });
        }
    });
};

exports.verify = function (req, res, next) {
    if (typeof req.query.token != "undefined") {
        User.findOne({ temporaryToken: req.query.token }, function (err, usr) {
            if (err) {
                res.json({ succes: false, error: err });
            }

            var token = req.query.token;

            jwt.verify(token, app.get('superSecret'), function (err, tkn) {
                if (err) {
                    res.json({ success: false, error: err });
                } else if (!usr) {
                    res.json({ success: false, message: "Wrong token." });
                } else {
                    User.findOneAndUpdate({ temporaryToken: token },
                        { $set: { confirmedEmail: true } }, { returnOriginal: false }
                        , function (err) {
                            if (err)
                                return res.send(err);
                            console.log("User has been successfully activated!");
                        });
                }
            });
        });
    } else {
        console.log("Token is absent.");
        return next();
    }

}

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
                //Send Mailer to reset password
                return res.json({
                    success: false,
                    message: "Authentication failed: Max attempts reached."
                });
            } else {
                var hash = user.password
                bcrypt.compare(req.body.password, hash, function (err, resp, done) {
                    if (err) {
                        res.json(err);
                    }
                    if (resp != true) {
                        user.loginAttemptCount += 1;
                        user.save(function (err, user) {
                            if (!err) {
                                return res.json({
                                    success: false,
                                    message: "Authentication failed: Wrong Password."
                                });
                            } else return res.send(err);
                        });
                    } else if (user.confirmedEmail != true) {
                        res.json({
                            success: false,
                            message: "Authentication failed: Email not confirmed."
                        });
                    } else {
                        user.loginAttemptCount = 0;
                        user.save(function (err, user) {
                            if (err)
                                return res.send(err);
                        });

                        var token = jwt.sign(user, app.get('superSecret'), {
                            expiresIn: 60 * 60 * 48
                        });
                        req.session.user = user;
                        req.session.user.temporaryToken = token;
                        return res.json({
                            success: true,
                            message: "You have successfully logged in!",
                            token: token
                        });
                    }
                });
            }
        }
    });
};

exports.persistence = function(req, res){
    if(!req.session.user){
        return res.status(401).send();
    }
    return res.status(200).send("done")
}

exports.add_friend = function (req, res) { //Are friends both sides?
    User.findOne({
        _id: req.params._id
    }, function (err, user) {
        if (err)
            return res.send(err);
        if (user) {
            User.findOne({
                _id: req.body._id
            }, function (err, friend) {
                if (err)
                    return res.send(err);

                if (friend) {
                    user.friends.push(friend);
                    user.save(function (err) {
                        if (err)
                            return res.send(err);
                        return res.json({
                            success: true,
                            message: "Friend added succesfully."
                        });
                    });
                } else
                    return res.json({
                        success: false,
                        id: req.body._id,
                        message: "User does not exist."
                    });
            })
        } else
            res.send({ "ERR": "Couldn't find user with id", "ID": req.params._id }) //change response
    })
};

exports.view_profile = function (req, res) {
    User.findOne({ _id: req.params._id }, function (err, usr) {
        if (err) {
            res.send({ success: false, message: "Could not find user." });
        }
        res.json(usr);
    });
}

exports.search_for_user = function (req, res) {
    User.findOne({ username: req.body.username }, function (err, usr) {
        if (err) {
            res.send({ success: false, message: "Could not find user." });
        }
        res.json(usr);
    });
}

exports.list_friends = function (req, res) {
    User.findOne({
        _id: req.params._id
    }).populate('friends').exec(function (err, user) {
        if (err)
            return res.send(err);
        res.json(user.friends);
    });
};
