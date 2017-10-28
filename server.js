const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const session = require('express-session');  // authenticate transactions between the client and the server. 
//Lets the server know that the client is the same person it has been talking to. (keeps 'bad people' away)
const morgan = require('morgan'); // HTTP request logger middleware 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');

const configDB = require('./config/DB.js');
mongoose.connect(configDB.url);
require('./config/passport.js')(passport);  // pass passport for configuration

app.use(morgan('dev'));  // log every request to the console
app.use(cookieParser());  // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "someRandomSecret",  // used to sign in session ID cookie
  saveUninitialized: true,  // when saving loggins to DB, saves even if the system goes down (user dont need to login again when system is back up)
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());  //  MUST be after the session from express-session to use it.
app.use(flash());


app.use('view engine', 'ejs');

require('./app/routes.js')(app, passport);

app.listen(port, () => { console.log('Server up and running..') });

