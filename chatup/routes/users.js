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
    User.findOne({ 'local.email': req.body.email }, function (err, user)
    {
        if (err) return res.status(500).send(err);
        if (user) return res.status(500).send('The email already taken');
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
                return done(null, aUser);
            });
        }
              
    });
});

router.get('/login', function (req, res)
{
    res.render('partial/login', { title: 'Login' });
});

router.post('/login', function (req, res)
{
    passport.authenticate('jwt', { session: false }),
    function (req, res)
    {
        res.send(req.user.profile);
    }
});


module.exports = router;