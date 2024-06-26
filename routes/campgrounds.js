const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground, logRequestAndFiles} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');
//const upload = multer({dest: 'uploads/'}); // tmp
const upload = multer({storage});


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(logRequestAndFiles, isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

    
router.get('/new', isLoggedIn, catchAsync(
    campgrounds.renderNewForm
));

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(logRequestAndFiles, isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(
    campgrounds.renderEditForm
));

module.exports = router;