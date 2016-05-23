var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database


var session = require('express-session')
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//add passport authentication
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
app.use(session({ secret: 'jswd0fsoknebtokkdfj3298wjkdaslkfjan' })); // session secret
opts.secretOrKey = 'jswd0fsoknebtokkdfj3298wjkdaslkfjan';
passport.use(new JwtStrategy(opts, function (jwt_payload, done)
{
    User.findOne({ id: jwt_payload.sub }, function (err, user)
    {
        if (err)
        {
            return done(err, false);
        }
        if (user)
        {
            done(null, user);
        } else
        {
            done(null, false);
            // or you could create a new account 
        }
    });
}));



var server = require('http').Server(app);
//add socket.io
var io = require('socket.io')(server);
server.listen(3000);
require('./routes/socket.js')(app, io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
