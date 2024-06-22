const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.get('/', catchAsync(
     campgrounds.index
));

router.get('/new', isLoggedIn, catchAsync(
    campgrounds.renderNewForm
));

router.post('/', isLoggedIn, validateCampground, catchAsync (
    campgrounds.createCampground
));

router.get('/:id', catchAsync(
    campgrounds.getCampground
));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render(`campgrounds/edit`, {campground});
    })
);

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const  {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

module.exports = router;