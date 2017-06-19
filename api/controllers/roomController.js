/*
Things that could go wrong not specified{
    Chat owner removes himself,
    Chat is empty
    User wants to leave chat
}
*/
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Message = require('../models/messageModel'),
    Room = mongoose.model('Rooms');


exports.add_room = function (req, res) {
    User.findOne({
        _id: req.params._id
    }, function (err, user) {
        if(err)
            res.send(err);

        var room = new Room({
            name: req.body.name,
            owner: user
        });
        room.save(function (err, newRoom) {
            if(err)
                res.send(err);
            user.rooms.push(newRoom);
            user.save(function (err) {
                if(err)
                    return res.send(err);

                newRoom.members.push(user);
                newRoom.save(function (err) {
                    if(err)
                        return res.send(err);

                    res.send({
                        success: true,
                        message: "New chat room added!"
                    });
                });
            });
        });
    });
};

exports.list_rooms = function (req, res) { //check if user is null
    User.findOne({
        _id: req.params._id
    })
        .populate('rooms')
        .exec(function (err, user) {
        if(err)
            return res.send(err);
        return res.json(user.rooms);
    });
};

exports.remove_member = function (req, res) { //Validacion de ser el dueño en frontend? Osea no dar opcion a menos que sea el dueño
    User.update(                                //Actualmente no revisa si existe el usuario o el room
        {_id: req.body._id},
        {$pull: {rooms: req.params._id}}
        ,function (err) {
            if(err)
                return res.send(err);
    });
    Room.update(
        {_id: req.params._id},
        {$pull: {members: req.body._id}}
        ,function (err) {
            if(err)
                return res.send(err);
    });
    return res.send({
        success: true,
        message: "User removed from chat."
    })
};

exports.add_member = function (req, res) { //Validacion de ser el dueño en frontend? Osea no dar opcion a menos que sea el dueño
    Room.findOne({
        _id: req.params._id
    }, function (err, room) {
        if(err)
            return res.send(err);
        if(room) {
            User.findOne({
                _id: req.body._id
            }, function (err, member) {
                if (err)
                    return res.send(err);

                if(member) {
                    room.members.push(member);
                    room.save(function (err) {
                        if (err)
                            return res.send(err);

                        member.rooms.push(room);
                        member.save(function (err) {
                            if(err)
                                return res.send(err);

                            return res.json({
                                success: true,
                                message: "Member added succesfully."
                            });
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
            res.send({"ERR": "Couldnt find room with id", "ID": req.params._id}) //change response
    })
};

exports.list_members = function (req, res) { //check if room is null
    Room.findOne({
        _id: req.params._id
    })
        .populate('members')
        .exec(function (err, room) {
            if(err)
                return re.send(err);
            return res.json(room.members)
        })
};

exports.send_message = function(req, res, next){  //make it so that only room members can send messages
    if(!req.body.text){
        res.send({ success: false, message: "Please write a message!" });
        return next();
    }

    if(!req.body.userId){
        res.send({ success: false, message: "Backend must provide userId" });
        return next();
    }

    var mssg = new Message({
        roomId: req.params._id,
        body: req.body.text,
        author: req.body.userId
    });

    Room.findOneAndUpdate({ _id: req.params._id },
        { $push: { "messages": mssg } }, { returnOriginal: false }, function (err, newroom) {
            if (err) {
                res.send({ success: false, message: "Room couldn't be found! Thus messages couldn't be pushed to the messages array" });
                return next();
            }
            mssg.save(function (err) {
                if (err) {
                    res.send({ success: false, message: "Message couldn't be saved to the database!" });
                    return next();
                }
                res.send({ succes: true, message: "Reply successfully sent!" });
                return next();
            });
        });
}

exports.get_specific_room = function(req, res, next){
     Room.findOne({ _id: req.params._id }, function (err, nroom) {
        if (err) {
            res.send({ success: false, message: "Room couldn't be found!" });
            return next();
        }
        Message.find({ roomId: req.params._id })
            .select('createdAt body author')
            .sort('-createdAt')
            .populate({
                path: 'author',
                select: 'name'
            })
            .exec(function (err, messages) {
                if (err) {
                    res.send({ success: false, error: err });
                    return next();
                }
                res.status(200).json({ Room: messages });
            });
    });
}

//Example of nested population
/*
 .populate({
 path: 'rooms',
 populate:{
 path: 'owner',
 populate: {
 path:'friends'
 }
 }
 })
*/