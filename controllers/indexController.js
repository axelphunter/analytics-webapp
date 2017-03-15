const baseController = require('./baseController');

module.exports = baseController.extend({
  name: 'Index',

  run(req, res) {
    if (req.session.user && req.session.user.jti) {
      console.log('here');
      return res.redirect(302, '/home');
    }

    return res.render('index', {
      hello: 'hey',
      notificationBar: req.flash('notify'),
      layout: 'index'
    });
  }
});
