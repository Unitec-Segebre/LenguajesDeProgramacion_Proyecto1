/*
Things that could go wrong not specified{
    Chat owner removes himself,
    Chat is empty
    User wants to leave chat
}
*/
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
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