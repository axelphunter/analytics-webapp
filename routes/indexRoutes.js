// dependencies
const indexController = require('../controllers/indexController');

// exports
module.exports = (app) => {
  app.get('/', indexController.run);
};
