'use strict';

var nodemailer = require('nodemailer'),
    config = require('/Users/Francis/Desktop/LenguajesDeProgramacion_Proyecto/config.js');

var transporter;
//var rand = Math.floor((Math.random() * 100) + 54);

exports.sendConfirmationEmail = function (token, req, res) {
    var host = req.get('host');
    var link = "http://" + req.get('host') + "/verify?id=" + token;

    var emailStuff = req.body.email;
    var smtpConfig;  //has to vary according to service (google, outlook or yahoo)

    if (emailStuff.indexOf("gmail") != -1) {
        smtpConfig = {
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
                user: "overchats@gmail.com",
                pass: config.overPass
            }
        };
    } else {
        console.log("Please use gmail.");
    }

    transporter = nodemailer.createTransport(smtpConfig);

    var mailOptions = {
        from: 'overchats@gmail.com',
        to: req.body.email,
        subject: "Overchat Email Confirmation",
        html: "<p><h1>Welcome to Overchat!</h1></p><p>Hello! You recently registered to <b>Overchat</b>, under the username " + req.body.username + ". Please click the link below to confirm your email. If you have not used this email to register to Overchat, please ignore this.</p><br><a href=" + link + ">Click here to confirm.</a></br>"
    }

    console.log(mailOptions);
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("MESSAGE SENT!");
            res.end("sent");
        }
    });

};