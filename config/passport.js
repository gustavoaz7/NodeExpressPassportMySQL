const LocalStrategy = require('passport-local').Strategy;

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
  })

  passport.deserializeUser(function(id, done) {
    connection.query('SELECT * FROM users WHERE id = ?', [id], function(err, rows) {
      done(err, rows[0])
    })
  });

  // LOCAL SIGNUP
  
  passport.use(
    'local-signup', 
    new LocalStrategy({
      'usernameField': 'username',
      'emailField': 'email',
      'passwordField': 'password',
      passReqToCallback: true   // allows us to pass back the entire request to the callback
    }, 
    function(req, username, email, password, done) {
      connection.query("SELECT * FROM users WHERE username = ?", [username], function(err, rows) {
        if (err) return done(err);
        if (rows.length) {  // if there is info under that username -> username taken
          return done(null, false, req.flash('signupMessage', 'This username already exists.'))
        } else {
          let newUser = {
            username: username,
            email: email,
            password: bcrypt.hashSync(password, null, null)  // use generateHash function in user model
          }
          let insertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
          connection.query(insertQuery, [newUser.username, newUser.email, newUser.pasword], function(err, rows) {
            if (err) return done(err);
            newUser.id = rows.insertId;
            return done(null, newUser)
          })
        }
      })
    })
  )
}