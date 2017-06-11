'use strict';
var nodemailer = require('nodemailer'),
    jwt = require('jsonwebtoken'),
    config = require('/Users/Francis/Desktop/LenguajesDeProgramacion_Proyecto1/config.js'); //change this later

var transporter;
var rand = Math.floor((Math.random() * 100) + 54);

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
    }else{
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

// FUNCTION TO CONFIRM EMAIL: MUST FIX AND ADD MORE STUFF REGARDING LOGIN ACCESS

exports.confirmProcess = function (req, res) {
    var host = req.get('host');
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("DOMAIN MATCHED.");
        if (req.query.id == rand) {
            console.log("EMAIL HAS BEEN VERIFIED!");
            res.end("<h1>Your email " + mailOptions.to + " has been successfully verified!");
            res.send({ "Email": "Confirmed!" });
        }
        else {
            console.log("EMAIL HAS NOT BEEN VERIFIED.");
            res.end("<h1>Bad Request</h1>");
            res.send({ "Email": "Not Confirmed!" });
        }
    }
    else {
        res.end("<h1>Request is from unknown source</h1>");
    }
}

