const express = require('express');
const app = express();
const port = process.PORT || 3000;
const cookieParser = require('cookie-parser');
const session = require('express-session');  // authenticate transactions between the client and the server. 
//Lets the server know that the client is the same person it has been talking to. (keeps 'bad people' away)
const morgan = require('morgan'); // HTTP request logger middleware 
const mongoose = require('mongoose');

const configDB = require('./config/DB.js');
mongoose.connect(configDB.url);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: "someRandomSecret",  // used to sign in session ID cookie
  saveUninitialized: true,  // when saving loggins to DB, saves even if the system goes down (user dont need to login again when system is back up)
  resave: true
}))

require('./app/routes.js');

app.listen(port, () => { console.log('Server up and running..') });

