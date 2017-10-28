const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user.js');

module.exports = function(passport) {
  /* Serialize and deserialize:
    Serialize: transforming a big data (every info about a user in DB) into a small data
    Deserialize: transform it back up
  */
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(user, done) {
    User.findOne(id, function(err, user) {
      done(err, user);
    })
  });

  passport.use('local-signup', new LocalStrategy({
    'username': 'email', //because of name on form @signup.ejs
    'password': 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    process.nextTick(function() {  // This doens't get executed until everything else is done.
       User.findOne({'local.username': email}, function(err, user) {
         if(err) return done(err);
         if(user) {
           return done(null, false, req.flash('signupMessage', 'That email is already in use'))
         } else {
          let user = new User();
          user.local.username = email;
          user.local.password = password;
          user.save(function(err) {
            if (err) throw err;
            return done(null, user);
          })
         }
       })
    })
  }))

}