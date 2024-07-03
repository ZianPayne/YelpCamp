if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const Campground = require('./../models/campground');
const Review = require('./../models/review');
const User = require('./../models/user');  
const {loremIpsum }= require('lorem-ipsum'); // for generating random text
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // For geoboxing
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

const {places, descriptors} = require('./seedHelpers')
const cities = require('./cities');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl).then(() => {
    console.log("Database connected!!");
}).catch(error => {
    console.error("Connection Error:", error);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const accessKey = 'process.env.UNSPLASH_ACCESS_KEY'; 
const imgUrl = 'https://api.unsplash.com/photos/random'; // replace with your actual Unsplash API endpoint

const generateRandomReviews = async (camp, user, numReviews) => {
    const reviews = [];
    for(let i = 0; i < numReviews; i++){
        const review = new Review({
            rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
            body: loremIpsum(),
            author: user._id // Admin user id
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

const simulateGeocode = async (location) => {
    const geodata = await geocoder.forwardGeocode({
        query : location,
        limit : 1
    }).send();
    
    return geodata.body.features[0].geometry;

};

const createAdminUser = async () => {
    try {
      // Check if the admin user already exists
      const existingUser = await User.findOne({ email: 'admin@gmail.com' });
      if (existingUser) {
        console.log('Admin user already exists');
        return existingUser;
      }
  
      // Create a new admin user
      const adminUser = new User({ username: 'admin', email: 'admin@gmail.com' });
      const registeredUser = await User.register(adminUser, 'admin'); // 'admin' is the password
      console.log('Admin user created:', registeredUser);
      return registeredUser;
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  }

const seedDB = async () => {
    try {
        await Campground.deleteMany({});
        await Review.deleteMany({});
        await User.deleteMany({});  
        console.log("Deleted all campgrounds");
        
        const adminUser = await createAdminUser();

        for (let i = 0; i < 80; i++) {
            const randomCity = Math.floor(Math.random() * cities.length);
            const price = Math.floor(Math.random() * 20 + 10);
            const location = `${cities[randomCity].city}, ${cities[randomCity].region}`;
            const camp = new Campground({
                location: location,
                title: `${sample(descriptors)} ${sample(places)}`,
                price: price,
                author: adminUser._id,
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
                images: getRandomImages(),
                geometry: await simulateGeocode(location) 
            });
            await camp.save();
            await generateRandomReviews(camp, adminUser._id, Math.floor(Math.random() * 5) + 1);
            console.log(camp);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error("An error occurred:", err);
        mongoose.connection.close();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})
