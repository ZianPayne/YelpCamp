const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(-1),
        location: Joi.string().required(),
        //images: Joi.array().required(),
        // images: Joi.array().items(
        //     Joi.object({
        //         url: Joi.string().required(),
        //         filename: Joi.string().required()
        //     })
        // ).required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});