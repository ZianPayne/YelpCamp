const User = require('../models/user');


module.exports.renderRegister = (req,res) => {
    res.render('users/register');
}


module.exports.register = 
    async(req,res) => {
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
}

module.exports.renderLogin = (req,res) => {
    res.render('users/login');
}


module.exports.login = (req,res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}