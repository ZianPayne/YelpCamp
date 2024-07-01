const baseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (Joi) => ({
    type: 'string',
    base: Joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not have HTML!'
    },
    rules : {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
    
});

const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(-1),
        location: Joi.string().required().escapeHTML(),
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
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});
