'use strict';

var mongoose = require('mongoose');

var PrivateChatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    "messages":[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages'
    }]
});

module.exports = mongoose.model('PrivateChats', PrivateChatSchema);