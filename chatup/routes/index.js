var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Welcome' });
});

router.get('/home', function (req, res)
{
    res.render('partial/home', { title: 'About Us' });
});

router.get('/about', function (req, res)
{
    res.render('partial/about', { title: 'About Us' });
});

router.get('/contact', function (req, res)
{
    res.render('partial/contact', { title: 'About Us' });
});
router.get('/register', function (req, res)
{
    res.render('partial/register', { title: 'About Us' });
});

router.get('/onlines', function (req, res)
{
    res.render('partial/onlines', { title: 'About Us' });
});

router.get('/user', function (req, res)
{
    res.render('partial/user', { title: 'About Us' });
});

router.get('/profile', function (req, res)
{
    res.render('partial/prfile', { title: 'About Us' });
});


module.exports = router;