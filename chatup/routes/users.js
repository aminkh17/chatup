var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/users.js');
var options = {
    secret: 'jswd0fsoknebtokkdfj3298wjkdaslkfjan',
    timeout: 5000
};

//protect router
router.use(function (req, res, next)
{
    if (req.originalUrl == '/users/register' || req.originalUrl == '/users/login') return next();
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token)
    {
        jwt.verify(token, options.secret, function (err, decoded)
        {
            if (err)
            {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else
            {
                req.decoded = decoded;
                next();
            }
        });

    } else
    {
        return res.status(403).send({
            success: false, 
            message: 'No token provided.'
        });
    
    }
});

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/register', function (req, res)
{
    res.render('partial/register', { title: 'Join Us' });
});
router.post('/register', function (req, res)
{
    User.findOne( {$or: [
            { 'local.email': req.body.email },
            {'local.username': req.body.username}
        ]}, function (err, user)
    {
        if (err) return res.status(500).send(err);
        if (user) return res.status(500).send('The email or username already taken');
        else
        {
            

            var aUser = new User();
            
            aUser.local.name = req.body.name;
            aUser.local.email = req.body.email;
            aUser.local.username = req.body.username;
            aUser.local.password = aUser.generateHash(req.body.password);

            aUser.save(function (err)
            {
                if (err) throw err;
                return res.status(200).send('registered');
            });
        }
              
    });
});

router.get('/login', function (req, res)
{
    res.render('partial/login', { title: 'Login' });
});


router.post('/login', function (req, res){
    //authenticate user then sign it
    User.findOne({ 'local.username': req.body.username }, function (err, user)
    {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(403).send('The username and password you entered did not match!');
        else
        {
            if (user.validPassword(req.body.password))
            {

                var token = jwt.sign({ id: user._id }, options.secret);
                return res.json({
                    success: true,
                    message: 'Welcome!',
                    token: token
                });
            }
            else
                return res.status(403).send('The username and password you entered did not match!');

        }
    });
});

router.post('/check', function (req, res)
{
    res.status(200).send('Ok');
});

router.post('/notify', function (req, res)
{
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token)
    {
        jwt.verify(token, options.secret, function (err, decoded)
        {
            if (err)
            {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else
            {
                req.decoded = decoded;
                User.findOne({ '_id': decoded.id }, function (err, user)
                { 
                    if (!err)
                    {
                        user.local.isOnline = 1;
                        user.save();

                    }

                    User.find({ 'local.isOnline': 1 }, function (err, users)
                    {
                        var resUsers = [];
                        for (var i = 0; i < users.length; i++)
                            resUsers.push({
                                'id': users[i]._id, 
                                'name': users[i].local.name,
                                'username': users[i].local.username,
                                'email': users[i].local.email,
                                'isOnline': users[i].local.isOnline,
                            });
                        res.json({ 'onlines': resUsers, 'me': user });
                    }
                    );
                });
            }
        });


    }


      
});

module.exports = router;