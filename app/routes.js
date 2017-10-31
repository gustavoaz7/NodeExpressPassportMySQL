module.exports = function (app, passport) {
  // Home page
  app.get('/', (req, res) => {
    res.render('index.ejs')
  })

  // Signup
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  app.post('/signup', passport.authenticate('local-signup'), {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true   // allow flash messages
  })
  
  
  
  // route middleware
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next;
    // if not, return to home page
    res.redirect('/')
  }
  
/*
  app.get('/:username/:password', (req, res) => {
    let user = new User();
    user.local.username = req.params.username;
    user.local.password = req.params.password;
    console.log(user);
    user.save(function(err) { if(err) throw err });
  })
  */
}