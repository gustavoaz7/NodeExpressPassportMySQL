const LocalStrategy = require('passport-local').Strategy;
const facebookConfig = require('./facebookInfo.js')

const mysql = require('mysql')
const bcrypt = require('bcrypt-nodejs')
const dbconfig = require('./database')

const connection = mysql.createConnection(dbconfig.connection)

connection.query('USE ' + dbconfig.database);


module.exports = function(passport) {
  /* Serialize and deserialize:
    Serialize: transforming a big data (every info about a user in DB) into a small data
    Deserialize: transform it back up
  */
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.query('SELECT * FROM users WHERE id = ?', [id], function(err, user) {
      done(err, user[0])  // user[0] = id
    })
  });

  // LOCAL SIGNUP
  
  passport.use(
    'local-signup', 
    new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true   // allows us to pass back the entire request to the callback
    }, 
    function(req, username, password, done) {
      connection.query("SELECT * FROM users WHERE username = ?", [username], function(err, user) {
        if (err) return done(err);
        if (user.length) {  // if there is info under that username -> username taken
          return done(null, false, req.flash('signupMessage', 'This username already exists.'))
        } else {
          const newUser = {
            username: username,
            password: bcrypt.hashSync(password, null, null)  // use generateHash function in user model
          }
          const insertQuery = "INSERT INTO users ( username, password ) values (?,?)";
          connection.query(insertQuery, [newUser.username, newUser.password], function(err, user) {
            newUser.id = user.insertId;
            return done(null, newUser)
          })
        }
      })
    })
  )
  
  passport.use('local-login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    }, 
    function(req, username, password, done) {
      connection.query("SELECT * FROM users WHERE username = ?", [username], function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, req.flash('loginMessage', 'Username not found.'))
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, req.flash('loginMessage', 'Incorrect password.'))
        }
        return done(null, user)
      })  
    })
  )
  
  


}


