'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
    chatId:{
        type: Schema.Types.ObjectId
        //required: false
    },
    body:{
        type: String,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Messages', MessageSchema);