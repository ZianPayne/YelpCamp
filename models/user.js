const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMonngoose = require('passport-local-mongoose');
const passport = require('passport');

const UserSchema = new Schema({
    email: {
        type : String,
        required :true,
        unique : true
    }
})


UserSchema.plugin(passportLocalMonngoose);

module.exports = mongoose.model('User', UserSchema);