// dependencies
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// exports
module.exports = (app) => {
  app.get('/api/user/list', authMiddleware.checkAuthSession, userController.getUserList);
  app.get('/api/user/:id/:username', authMiddleware.checkAuthSession, userController.getUser);
  app.post('/api/user/:id/:username', authMiddleware.checkAuthSession, userController.updateUser);
  app.get('/api/user/delete/:id/:username', authMiddleware.checkAuthSession, userController.deleteUser);
  app.post('/api/user/create', authMiddleware.checkAuthSession, userController.postCreateUser);
};
