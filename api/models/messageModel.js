'use strict';

var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId
       // required: true
    },
    body:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
},
{   
    timestamps: true
});

module.exports = mongoose.model('Messages', MessageSchema);