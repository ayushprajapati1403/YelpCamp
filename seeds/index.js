require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_cloud_key,
  api_secret: process.env.cloudinary_cloud_secret,
});

const options = {
  resource_type: "image",
  max_results: 500,
  prefix: 'yelpCamp',
  type:'upload'
};




const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
	console.log('database connected')
})
.catch(err=>{
	console.log('error detected');
	console.log(err);
})

const Campground=require('../models/campground');
const cities=require('./cities');
const seedhelpers=require('./seedHelpers');
const {descriptors,places}= seedhelpers;

const sample=array=>{
	return array[Math.floor(Math.random()*(array.length))]
}

const SeedDB= async ()=>{
	await Campground.deleteMany({});


	const campgroundImages = [];
	await cloudinary.api.resources(options).then((res) => {
	  res.resources.forEach((asset) => {
		  campgroundImages.push({ url: asset.secure_url, filename: asset.public_id });
	  });
	});
	

	
	for(let i=0;i<300;i++){
		const random= Math.floor(Math.random()*500);
		const randomimgIndex = Math.floor(Math.random() * campgroundImages.length);
	 const camp=new Campground({
		//author id 
		author:'668f917a5a039c7615f99707',
		title:`${sample(descriptors)} ${sample(places)}`,
		location:`${cities[random].city},${cities[random].state}`,
		price:`${Math.floor(Math.random()*20)+10}`,
		geometry: {
			type: "Point",
			coordinates:[cities[random].longitude,cities[random].latitude]
			
		},
		description:" Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore doloribus delectus esse debitis tempora maxime dolorum qui possimus. Nemo illum libero porro. Necessitatibus at, harum sunt iure laboriosam quasi excepturi eum minima molestiae, exercitationem tenetur consectetur! Et officiis amet ipsum?",
		images:[campgroundImages[randomimgIndex],campgroundImages[randomimgIndex+1],campgroundImages[randomimgIndex+2]]
		// [
		// 	{
		// 		url: 'https://res.cloudinary.com/dw87xcai1/image/upload/v1720958517/yelpCamp/swmsb2yquynrrueojdhz.jpg',
		// 		filename: 'yelpCamp/swmsb2yquynrrueojdhz',
		// 	  },
		// 	  {
		// 		url: 'https://res.cloudinary.com/dw87xcai1/image/upload/v1720958520/yelpCamp/wpmghhzpnjko6r6reppp.jpg',
		// 		filename: 'yelpCamp/wpmghhzpnjko6r6reppp',
		// 	  },
		// 	  {
		// 		url: 'https://res.cloudinary.com/dw87xcai1/image/upload/v1720958520/yelpCamp/rfp5buhr0s7gvrsbz3h8.jpg',
		// 		filename: 'yelpCamp/rfp5buhr0s7gvrsbz3h8',
		// 	  }
		// ]
	})
	await camp.save();
}
	
	
}

SeedDB()
.then(()=>{
	mongoose.connection.close();
})