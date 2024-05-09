const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected!!");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/', (req,res) => {
    res.render('home');
})

app.get('/makeCampground', async (req,res) => {
    const camp = new Campground({title : "Mount Vic", description: "Not a campsite"});
    await camp.save();
    res.send(camp);
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
});