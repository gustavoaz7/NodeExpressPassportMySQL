module.exports = function (app, passport) {
  // Home page
  app.get('/', (req, res) => {
    res.render('index.ejs')
  })
  
  // Login
  app.get('/login', (req, res) => {
    res.render('login.ejs', {message: req.flash('loginMessage')})
  })
  
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }))

  // Signup
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true   // allow flash messages
  }))
  
  // Logout
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
  })
  
  
  // Logged in
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {user: req.user})
  })
  
  
  // route middleware
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();
    // if not, return to home page
    res.redirect('/login')
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