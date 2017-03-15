const baseController = require('./baseController');
const layoutSchemaModel = require('../models/layoutSchemaModel');

module.exports = baseController.extend({
  name: 'Home',

  run(req, res) {
    const session = req.session;
    console.log(session.user);
    const pageId = req.originalUrl;

    layoutSchemaModel.findOne({
      uid: session.user.uid
    }, (err, entity) => {
      if (err) {
        console.log(err);
      }
      return res.render('home', {
        notificationBar: req.flash('notify'),
        pageId,
        user: session.user,
        layout: JSON.stringify(entity)
      });
    });
  }
});
