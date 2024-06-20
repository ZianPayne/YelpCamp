const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const flash = require('connect-flash');
const {storeReturnTo} = require('../middleware/storeReturnTo');

router.use(flash());

router.get('/register', (req,res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req,res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username, password});
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    } catch(e){
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req,res) => {
    res.render('users/login');
});

router.post('/login',
    storeReturnTo,
    passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}),
    (req,res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl);
});

router.get('/logout', (req,res) => {
    req.logout(function(err){
        if (err){
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
})

module.exports = router;