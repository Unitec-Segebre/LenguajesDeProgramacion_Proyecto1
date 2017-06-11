'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PrivateChatSchema = new Schema({
    otherUser:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
    /*Messages:[{
        type: Schema.Types.ObjectId,
        ref: 'Messages'
    }]
    participants: [{ type: Schema.Types.ObjectId, ref: 'Users'}]*/
});

module.exports = mongoose.model('PrivateChats', PrivateChatSchema);