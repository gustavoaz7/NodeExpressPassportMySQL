const User = require('./models/user.js');

module.exports = function (app, passport) {
  app.get('/', (req, res) => {
    res.render('index.ejs')
  })

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  app.post('/signup', passport.authenticate('local-signup'), {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  })

  app.get('/:username/:password', (req, res) => {
    let user = new User();
    user.local.username = req.params.username;
    user.local.password = req.params.password;
    console.log(user);
    user.save(function(err) { if(err) throw err });
  })
}