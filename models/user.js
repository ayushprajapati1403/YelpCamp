const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
	email :{
		type:String,
		reqiured:true,
		unique:true
	}
});

UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',UserSchema)