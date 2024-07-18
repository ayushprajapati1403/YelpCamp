const express=require('express');
const campgrounds=require('../controllers/campgrounds')
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const {isLogedin,storeReturnTo,isAuthor,validateCampground,validateReview}=require('../middleware');
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({ storage });



router.route('/')
		.get(catchAsync(campgrounds.index))
		.post(upload.array('campground[image]'),validateCampground,catchAsync(campgrounds.createCampground));
		// .post(upload.array('image',19),(req, res) => {
		// 	console.log(req.body, req.files);
		// 	res.send('it worked');
		// })


router.get('/new',isLogedin,(campgrounds.renderNewForm))

router.route('/:id')
		.get(catchAsync(campgrounds.showCampground))
		.delete(isLogedin,isAuthor,catchAsync(campgrounds.deleteCampground))
		.put(upload.array('campground[image]'),validateCampground,isAuthor,catchAsync(campgrounds.updateCampground));


router.get('/:id/edit',isLogedin,isAuthor,catchAsync(campgrounds.renderEditForm));



module.exports = router;