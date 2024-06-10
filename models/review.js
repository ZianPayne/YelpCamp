const mongoose = require('mongoose');
const Schema = mongoos.Schema;

const reviewSchema = new Schema({
    body : String,
    rating : Number
});



module.exports = mongoos.model('Review', reviewSchema);