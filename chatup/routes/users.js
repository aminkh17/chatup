var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

var User = require('../models/users.js');

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
var options = {
    secret: app.set('TheSecret'),
    timeout: 5000
};

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

router.get('/check', function (req, res)
{
    jwt.verify(data.token, options.secret, options, 
        function (err, decoded)
    {
        if (err) return res.status(403).send('Unauthorized');
        if (!err && decoded)
            return res.status(200).send('Authorized');
        else
            return res.status(403).send('Unauthorized');
    });
});

module.exports = router;