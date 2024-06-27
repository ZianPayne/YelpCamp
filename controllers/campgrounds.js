
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
};


module.exports.renderNewForm = async (req,res) => {
    res.render('campgrounds/new'); 
};

module.exports.createCampground = async (req,res) => {
    // console.log(req.body);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async(req, res, next) => {
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

    
module.exports.renderEditForm = async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render(`campgrounds/edit`, {campground});
    }



module.exports.updateCampground = async(req,res) => {
    //console.log(req.body);
    const {id} = req.params;
    // console.log(req.body);
    // console.log(req.files);
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map( f => ({url: f.path, filename: f.filename}));


    imgs.forEach(img => {campground.images.push(img);});
    await campground.save();


    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){{
            console.log(filename);
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    await campground.save();

    req.flash('success', 'Successfully updated campground!')
    console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`);
    }
}

module.exports.destroyCampground = async(req,res) => {
    const  {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}