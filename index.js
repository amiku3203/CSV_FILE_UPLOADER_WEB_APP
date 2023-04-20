require('dotenv').config();

const express = require('express');

const app = express();

const port = process.env.PORT;

const expressLayouts = require('express-ejs-layouts');

const MongoStore=require('connect-mongo');

const session=require('express-session');

const cookieParser=require('cookie-parser');

const BodyParser=require('body-parser');
 
const db=require('./config/mongoose');

 
app.use(BodyParser.json());
 
app.use(BodyParser.urlencoded({extended:true}));
 

app.use(express.static('./assests'));

app.use(expressLayouts);
 

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


 
app.use('/', require('./routes'));

 
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
   name:'CodeWithAmit',
    //ToDo change the secret before deployment in produnction mode
   secret: 'blasomething',
   saveUninitialized:false,
   resave:false,
   cookie: {
    maxAge:(100*60*100)
   },
   store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      autoRemove:'disabled'

   },function(err){
    if(err){
      console.log('err');   
    }
   })
     
 }));
app.listen(port,function(err){
   if(err){
      console.log("Eror in connecting to server",err);
   }
   console.log(`Ya finally we connected to express server on port : ${port}`);
});


