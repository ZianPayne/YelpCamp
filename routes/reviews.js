const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', validateReview, isLoggedIn, catchAsync(
    reviews.createReview
));


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req,res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;