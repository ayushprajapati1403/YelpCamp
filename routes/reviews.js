const express=require('express');
const router=express.Router({mergeParams:true});
const reviews=require('../controllers/reviews')
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {isLogedin,storeReturnTo,isAuthor,validateCampground,validateReview,isreviewAuthor}=require('../middleware');





router.post('/',isLogedin,validateReview,catchAsync(reviews.createReview))

router.delete('/:reviewId',isLogedin,isreviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;