// dependencies
const authController = require('../controllers/authController');

// exports
module.exports = (app) => {
  app.post('/auth/login', authController.logIn);
  app.get('/auth/logout', authController.logOut);
  app.post('/auth/forgot', authController.forgotPassword);
  app.post('/auth/verify', authController.verifyAuthCode);
  app.post('/auth/passwordReset', authController.resetUserPassword);
};
