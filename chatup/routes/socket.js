//Socket.io route file
var jwt = require('jsonwebtoken');
module.exports = function (app, io)
{
    var options = {
        secret: 'jswd0fsoknebtokkdfj3298wjkdaslkfjan',
        timeout: 5000
    };
    
    //function findClientsSocket()
    //{
    //    return Object.keys(socket.adapter.rooms[room_id])
    //}
    var clients = [];
    
    io.sockets.on('connect', function (client)
    {
        clients.push(client);
        
        client.on('disconnect', function ()
        {
            clients.splice(clients.indexOf(client), 1);
        });
    });
    
    
    
    //io.sockets.on('connection', function (socket)
    //{
    //    delete io.sockets.connected[socket.id];
        
    //    var options = {
    //        secret: app.get('TheSecret'),
    //        timeout: 5000
    //    };
    //    var auth_timeout = setTimeout(function ()
    //    {
    //        socket.disconnect('unauthorized');
    //    }, options.timeout || 5000);


    //    var authenticate = function (data){
    //        clearTimeout(auth_timeout);
    //        jwt.verify(data.token, options.secret, options, 
    //            function (err, decoded)
    //        {
    //            if (err)
    //            {
    //                socket.disconnect('unauthorized');
    //            }
    //            if (!err && decoded)
    //            {
    //                io.sockets.connected[socket.id] = socket;
    //                socket.decoded_token = decoded;
    //                socket.connectedAt = new Date();
    //                socket.on('disconnect', function ()
    //                {
    //                    console.info('SOCKET [%s] DISCONNECTED', socket.id);
    //                });

    //                console.info('SOCKET [%s] CONNECTED', socket.id);
    //                socket.emit('authenticated');
    //            }
    //        });
    //    }
    //    socket.on('authenticate', authenticate);

    //    socket.on('ready', function ()
    //    {

    //    });
    //});
    
    io.on('connection', function (socket)
    {
        //Globals
        var User = require('../models/users.js');
        
        delete io.sockets.connected[socket.id];

        var authenticate = function (data)
        {
            jwt.verify(data.token, options.secret, options, 
                        function (err, decoded)
            {
                if (err)
                {
                    socket.disconnect('unauthorized');
                }
                if (!err && decoded)
                {
                    io.sockets.connected[socket.id] = socket;
                    socket.decoded_token = decoded;
                    socket.connectedAt = new Date();
                    User.findOne({ '_id': decoded.id }, function (err, user)
                    {
                        console.log('User: ' + user.local.name);
                        if (!err)
                        {
                            socket.userInfo = user;
                            user.local.isOnline = 1;
                            if(user.sockets.indexOf(socket.id)<0)
                                user.sockets.push(socket.id);
                            user.save();
                        }
                    });
                    socket.on('disconnect', function ()
                    {
                        User.findOne({ '_id': decoded.id }, function (err, user)
                        {
                            console.log('User: ' + user.local.name);
                            if (!err)
                            {
                                if (user.sockets.indexOf(socket.id) < 0)
                                    user.sockets.splice(user.sockets.indexOf(socket.id), 1);
                                user.local.isOnline = 0;
                                user.save();
                                console.info('User ' + user.local.name + ' disconnected');
                            }
                        });
                        console.info('SOCKET [%s] DISCONNECTED', socket.id);
                    });
                    
                    console.info('SOCKET [%s] CONNECTED', socket.id);
                    socket.emit('authenticated');
                }
            });
        }

        console.log('User connected: ' + socket.client.id);
        
        socket.on('authenticate', authenticate);

        socket.on('chat', function (data)
        {
            console.log('chat' + data.message);
            data.sDate = new Date();
            var who = data.who;
            User.findOne({ '_id': who.id }, function (err, user)
            {
                if (err) return;
                if (user)
                {
                    if (user.sockets.length > 0)
                        user.sockets.forEach(function (sck)
                        {
                            var MSG = {};
                            MSG.message = data.message;
                            MSG.sDate = data.sDate;
                            MSG.from = 'U';
                            MSG.me = who;
                            MSG.who = data.me;
                            io.to(sck).emit('chat',MSG);
                        });
                }
            });
            //var m = data.msg;
            //io.emit('chat', { 'comp': m });
        });

        //socket.on('IM-ONLINE', function (data)
        //{
        //    //set I'm online now,
        //    var query = User.find({
        //        status: 1
        //    });
        //    query.exec(function (onlines)
        //    {
        //        socket.emit('onlines', onlines);
        //    });
        //});
        
        socket.on('disconnect', function (data)
        {
            console.log('User disconnected');
        });
        
        
    });

};

