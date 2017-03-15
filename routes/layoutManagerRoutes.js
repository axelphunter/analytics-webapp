// dependencies
const layoutManagerController = require('../controllers/layoutManagerController');
const authMiddleware = require('../middleware/authMiddleware');

// exports
module.exports = (app) => {
  // app.post('/api/layout/create', authMiddleware.checkAuthSession, layoutManagerController.postLayoutCreate);
  // app.get('/api/layout/:uid/default', authMiddleware.checkAuthSession, layoutManagerController.getDefaultLayoutByUid);
  app.post('/api/layout/update', authMiddleware.checkAuthSession, layoutManagerController.postUpdateLayout);
  // app.get('/api/layout/:uid/all', authMiddleware.checkAuthSession, layoutManagerController.getAllLayoutsByUid);
  // app.get('/api/layout/remove/:uid', authMiddleware.checkAuthSession, layoutManagerController.getRemoveLayoutByUid);
};
