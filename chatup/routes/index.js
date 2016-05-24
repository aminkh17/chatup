var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var jwt = require('jsonwebtoken');
var options = {
    secret: 'jswd0fsoknebtokkdfj3298wjkdaslkfjan',
    timeout: 5000
};
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Welcome' });
});

router.get('/home', function (req, res)
{
    res.render('partial/home', { title: 'Welcome' });
});

router.get('/about', function (req, res)
{
    res.render('partial/about', { title: 'About Us' });
});

router.get('/contact', function (req, res)
{
    res.render('partial/contact', { title: 'Contact Us' });
});

router.get('/onlines', function (req, res)
{
    res.render('partial/onlines', { title: 'Online Users' });
});

router.get('/user', function (req, res)
{
    res.render('partial/user', { title: 'User' });
});

router.get('/dashboard', function (req, res)
{
    res.render('partial/profile', { title: 'Profile' });
});
router.get('/chat/:userid', function (req, res)
{
    User.findOne({ '_id': req.params.userid }, function (err, user)
    {
        if (!err)
        {
            if(user)
            res.render('partial/chat', {
                    title: 'Welcome to chat', 
                    friend: { "id": user.id, "name": user.local.name, "username": user.local.username, "email": user.local.email }
                });
            return;
        }
    });
});

module.exports = router;