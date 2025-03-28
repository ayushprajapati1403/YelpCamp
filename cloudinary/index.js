const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
cloud_name:process.env.cloudinary_cloud_name,
api_key:process.env.cloudinary_cloud_key,
api_secret:process.env.cloudinary_cloud_secret
})

const storage = new CloudinaryStorage({
	cloudinary,
	params:{
	folder:'yelpCamp',
	allowedFormets:['jpeg','png','jpg']
	}
})


module.exports={
	cloudinary,
	storage
}