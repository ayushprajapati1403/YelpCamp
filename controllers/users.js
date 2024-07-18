const User=require('../models/user');


module.exports.register=async(req,res)=>{
	try{const {email,username,password}=req.body;
	const user=new User({email,username});
   const registeredUser=await User.register(user,password);
   req.login(registeredUser,err=>{
	   if (err) {
		   return next(err);}
   req.flash('success',`Welcome to the Yelp Camp ${req.user.username}`);
   res.redirect('/campground');
   });
   }catch(e){
   req.flash('error',e.message);
   res.redirect('register');
   }
   }


   module.exports.renderRegister=(req,res)=>{
	res.render('users/register');
}

module.exports.renderLogin=(req,res)=>{
	res.render('users/login');
		}

module.exports.Login=(req,res)=>{
	req.flash('success',`welcome back to the yelpcamp   ${req.user.username} `);
	 const redirectUrl = res.locals.returnTo || '/campground'
	
	 delete req.session.returnTo;
	res.redirect(redirectUrl);
		}

module.exports.Logout=(req,res)=>{
	req.logout(function (err) {
        if (err) {
            return next(err);
			
        }
	req.flash('success','goodbye');
	res.redirect('/campground')
	})

}