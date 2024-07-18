if(process.env.NODE_ENV!=="production"){
	require('dotenv').config();
}
console.log(process.env.cloudinary_cloud_name)



const express=require('express');
const app=express();
const ejsMate=require('ejs-mate');
app.engine('ejs',ejsMate);

const dbUrl='mongodb://localhost:27017/yelp-camp'
const mongoose=require('mongoose');
mongoose.connect(dbUrl)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })





const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes=require('./routes/users');
const ExpressMongoSanitize=require('express-mongo-sanitize')
const helmet=require('helmet');

const ExpressError=require('./utils/ExpressError');
const session=require('express-session');
const flash = require('connect-flash');
const methodOverride=require('method-override');
app.use(methodOverride('_method'))
const passport=require('passport');
const LocalStratergy=require('passport-local');
const User=require('./models/user');
const MongoStore=require('connect-mongo')


const store =  MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'oraoraora'
    }
});

sessionConfig={
    store,
	name:'Session',
	secret:'oraoraora',
	resave:false,
	saveUninitialized:true,
	cookie:{
		httpOnly: true,
		// secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
	}
}


store.on("error",function(e){
    console.log('mongo session error');
    console.log(e);
})

app.use(session(sessionConfig));

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// const dbUrl=process.env.db_url;



app.use((req, res, next) => {
	res.locals.currentUser=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use(ExpressMongoSanitize());
	
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
	 "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dw87xcai1/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


const path=require('path');
const review = require('./models/review');
const { name } = require('ejs');

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))




app.use('/',userRoutes);
app.use('/campground',campgroundRoutes);
app.use('/campground/:id/reviews',reviewRoutes);


app.get('/',(req,res)=>{
	res.render('home');
})


app.get('/fakeUser',async(req,res)=>{
	const user=new User({email:'ayush@gmail.com',username:'ayush'})
	const newUser=await User.register(user,'cat');
	res.send(newUser);
})




app.all('*',(req,res,next)=>{
	next( new ExpressError('Page not found!!',404));
})

app.use((err,req,res,next)=>{
	const {STATUS_CODES=500}=err;
	if(!err.message){
		err.message='error!something went wrong';
	}
	res.status(STATUS_CODES).render('error',{err});
})


app.listen(3000,()=>{
  console.log('server started');
})


