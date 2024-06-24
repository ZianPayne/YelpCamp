if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const Campground = require('./../models/campground');
const Review = require('./../models/review');
const {loremIpsum }= require('lorem-ipsum'); // for generating random text

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

const accessKey = 'process.env.UNSPLASH_ACCESS_KEY'; 
const imgUrl = 'https://api.unsplash.com/photos/random'; // replace with your actual Unsplash API endpoint

const generateRandomReviews = async (camp, numReviews) => {
    const reviews = [];
    for(let i = 0; i < numReviews; i++){
        const review = new Review({
            rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
            body: loremIpsum(),
            author: '6673e20b236d698825f237de' // Admin user id
        });
        await camp.reviews.push(review);
        await review.save();
        await camp.save();
    }
    return reviews;
}


const getImage = async () => {
    const response = await fetch(imgUrl, {
        headers: { Authorization: `Client-ID ${accessKey}` }
    });
    const data = await response.json();
    console.log(data.urls.regular);
    return data.urls.regular;
}

const getRandomImages = () => {
    const baseUrls = [
        "https://res.cloudinary.com/dmblkxr03/image/upload/f_auto,q_auto/v1/YelpCamp/uvduhs3n0w6m2kvgfkem",
        "https://res.cloudinary.com/dmblkxr03/image/upload/f_auto,q_auto/v1/YelpCamp/iqg9tbbrpbtcfl3skuge",
        "https://res.cloudinary.com/dmblkxr03/image/upload/f_auto,q_auto/v1/YelpCamp/zb0rkgebtaozydicrxay",
        "https://res.cloudinary.com/dmblkxr03/image/upload/f_auto,q_auto/v1/YelpCamp/ltoajpkgi7xrm3i7fc0d",
        "https://res.cloudinary.com/dmblkxr03/image/upload/f_auto,q_auto/v1/YelpCamp/en397nuynahibhvwhond"
    ];

    const selectedImages = [];
    const numberOfImages = Math.floor(Math.random() * 3) + 1; // 1 to 3 images

    for (let i = 0; i < numberOfImages; i++) {
        const randomIndex = Math.floor(Math.random() * baseUrls.length);
        const url = baseUrls[randomIndex];
        const filename = url.split('/').pop(); // Extracts filename from URL

        selectedImages.push({
            url,
            filename: `YelpCamp/${filename}`
        });
    }

    return selectedImages;
};


const seedDB = async () => {
    await Campground.deleteMany({});
    console.log("Deleted all campgrounds")
    for(let i = 0; i<30;i++){
        const random20 = Math.floor(Math.random() * 20);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground({
            location: `${cities[random20].city}, ${cities[random20].region}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            author: '6673e20b236d698825f237de',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
            images:   getRandomImages(), 
        });
        await camp.save();
        await generateRandomReviews(camp ,Math.floor(Math.random() * 5) + 1);
        console.log(camp);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})