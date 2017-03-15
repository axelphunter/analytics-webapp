// dependencies
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');

// exports
module.exports = (app) => {
  app.get('/api/tenant/list', authMiddleware.checkAuthSession, tenantController.getTenantList);
  app.get('/api/tenant/:tenantCode', authMiddleware.checkAuthSession, tenantController.getTenant);
  app.post('/api/tenant/:tenantCode', authMiddleware.checkAuthSession, tenantController.updateTenant);
  // app.get('/tenant/delete/:id/:tenant', authMiddleware.checkAuthSession, tenantController.deleteTenant);
  app.get('/api/tenant/create', authMiddleware.checkAuthSession, tenantController.getCreateTenant);
  app.post('/api/tenant/create', authMiddleware.checkAuthSession, tenantController.postCreateTenant);
};
