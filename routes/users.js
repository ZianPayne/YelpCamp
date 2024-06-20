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
    const {email, username, password} = req.body;
    try{
        const user = new User({email, username, password});
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, err => {
            if (err){
                req.flash('error', err.message);
                return res.redirect('/register');
            }
            req.flash('success', 'Welcome to YelpCamp!');
            return res.redirect('/campgrounds');
        });
    } catch(e){
        console.log(e);
        req.flash('error', e.message);
        return res.redirect('/register');
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
            req.flash('error', err.message);
            res.redirect('/campgrounds');
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
})

module.exports = router;