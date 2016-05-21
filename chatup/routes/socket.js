//Socket.io route file
var jwt = require('jsonwebtoken');
module.exports = function (app, io)
{
    
    function findClientsSocket()
    {
        return Object.keys(socket.adapter.rooms[room_id])
    }
    var clients = [];
    
    io.sockets.on('connect', function (client)
    {
        clients.push(client);
        
        client.on('disconnect', function ()
        {
            clients.splice(clients.indexOf(client), 1);
        });
    });
    
    io.sockets.on('connection', function (socket)
    {
        delete io.sockets.connected[socket.id];
        
        var options = {
            secret: 'jswd0fsoknebtokkdfj3298wjkdaslkfjan',
            timeout: 5000
        };
        var auth_timeout = setTimeout(function ()
        {
            socket.disconnect('unauthorized');
        }, options.timeout || 5000);
        
        var authenticate = function (data){
            clearTimeout(auth_timeout);
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
                    socket.on('disconnect', function ()
                    {
                        console.info('SOCKET [%s] DISCONNECTED', socket.id);
                    });

                    console.info('SOCKET [%s] CONNECTED', socket.id);
                    socket.emit('authenticated');
                }
            });
        }
        socket.on('authenticate', authenticate);

        socket.on('ready', function ()
        {

        });
    });
    
    io.on('connection', function (socket)
    {
        //Globals
        var mongoose = require('mongoose');
        var User = mongoose.model('User');
        
        //socket.emit('init', {
        //    name: findClientsSocket()
        //});
        
        socket.on('IM-ONLINE', function (data)
        {
            //set I'm online now,
            var query = User.find({
                status: 1
            });
            query.exec(function (onlines)
            {
                socket.emit('onlines', onlines);
            });
        });
        
        socket.on('send:message', function (data)
        {
            socket.broadcast.emit('send:message', {
                user: name,
                text: data.message
            });
        });
        
        socket.on('disconnect', function (data)
        {

        });
        
        
        socket.on('new user', function (data)
        {
            data.room = defaultRoom;
            socket.join(defaultRoom);
            io.in(defaultRoom).emit('user joined', data);
        });
        
        socket.on('switch room', function (data)
        {
            socket.leave(data.oldRoom);
            socket.join(data.newRoom);
            io.in(data.oldRoom).emit('user left', data);
            io.in(data.newRoom).emit('user joined', data);

        });
        
        socket.on('new message', function (data)
        {
            var newMsg = new Chat({
                username: data.username,
                content: data.message,
                room: data.room.toLowerCase(),
                created: new Date()
            });
            newMsg.save(function (err, msg)
            {
                io.in(msg.room).emit('message created', msg);
            });
        });
    });

};

