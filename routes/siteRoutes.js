// dependencies
const siteController = require('../controllers/siteController');
const authMiddleware = require('../middleware/authMiddleware');

// exports
module.exports = (app) => {
  app.get('/api/site/list', authMiddleware.checkAuthSession, siteController.getSiteList);
  app.get('/api/site/:id', authMiddleware.checkAuthSession, siteController.getSite);
  // app.post('/api/user/:id/:username', authMiddleware.checkAuthSession, siteController.updateUser);
  app.get('/api/site/delete/:id', authMiddleware.checkAuthSession, siteController.deleteSite);
  // app.post('/api/user/create', authMiddleware.checkAuthSession, siteController.postCreateUser);
};
