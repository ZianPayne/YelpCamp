const mongoose = require('mongoose');
const Campground = require('./../models/campground');

const {places, descriptors} = require('./seedHelpers')
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected!!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i<50;i++){
        const random20 = Math.floor(Math.random() * 20);
        const camp = new Campground({
            location: `${cities[random20].city}, ${cities[random20].region}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit'
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})