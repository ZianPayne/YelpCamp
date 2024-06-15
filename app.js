const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync.js');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');
const campground = require('./models/campground');
const session = require('express-session');
const flash = require('connect-flash')

const campgrounds = require('./routes/campgrounds.js');
const reviews = require('./routes/reviews.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected!!");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));


const sessionConfig = {
    secret: 'thisshouldbechanged',
    resave: false,
    saveUninitialised: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}

app.use(session(sessionConfig));
app.use(flash());   

app.use((req,res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// Routing
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews); 

app.get('/', (req,res) => {
    res.render('home');
});


app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong';  

    res.status(statusCode).render('error' , {err});
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});