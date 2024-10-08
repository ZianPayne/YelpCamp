const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = {
    toJSON: {
        virtuals: true
    }
}

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    images: [ImageSchema],
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates : {
            type: [Number],
        }
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strnog><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,20)}...</p>
    `;
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);