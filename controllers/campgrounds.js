
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
};


module.exports.renderNewForm = async (req,res) => {
    res.render('campgrounds/new'); 
};

module.exports.createCampground = async (req,res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.getCampground = async(req, res, next) => {
        const campground = await Campground.findById(req.params.id).populate({
            path : 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');

        if (!campground){
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', {campground});
    }