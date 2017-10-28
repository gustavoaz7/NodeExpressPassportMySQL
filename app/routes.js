const User = require('./models/user.js');

module.exports = function (app) {
  app.get('/', (req, res) => {
    res.send('Landing page.');
  })

  app.get('/:username/:password', (req, res) => {
    let user = new User();
    user.local.username = req.params.username;
    user.local.password = req.params.password;
    console.log(user);
    user.save(function(err) { if(err) throw err });
  })
}