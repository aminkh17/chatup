var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

var user = require('./index.js')

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