require('dotenv').config();

// Core Node.js Modules
const path = require('path');

// Third-Party Middleware/Modules
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Local Imports
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');

// Database URL
// const dbUrl = process.env.NODE_ENV === "production" ? process.env.DB_URL : 'mongodb://localhost:27017/yelp-camp';
// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';


mongoose.connect(dbUrl, {
});

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected!!");
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});


const sessionConfig = {
    store,
    name : 'yelp-session',
    secret: 'thisshouldbechanged',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // secure: true,
        httpOnly: true,
    }
}

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(mongoSanitize({
    replaceWith: "_"
}));


app.use(morgan('dev'));

app.use(session(sessionConfig));
app.use(flash());   

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmblkxr03/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use((req,res, next) => {                    // Global stuff
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


// Routing
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes); 
app.use('/', userRoutes);

app.get('/fakeUser', async (req,res) => {
    const user = new User({email: 'zian@payne.name', username: 'naiz'});
    const newUser = await User.register(user, 'admin');
    res.send(newUser);
})


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