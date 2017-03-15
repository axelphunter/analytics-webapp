// dependencies
const homeController = require('../controllers/homeController');
const authMiddleware = require('../middleware/authMiddleware');

// exports
module.exports = (app) => {
  app.get('*', authMiddleware.checkAuthSession, homeController.run);
};
