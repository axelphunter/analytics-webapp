const baseController = require('./baseController');
const request = require('request-promise');
const config = require('config');
const notificationService = require('../services/notificationService');
let subscriptionServiceApi = config.subscriptionServiceApi;
subscriptionServiceApi = `${subscriptionServiceApi.protocol}://${subscriptionServiceApi.host}:${subscriptionServiceApi.port}`;

module.exports = baseController.extend({
  name: 'Tenant',

  getTenantList(req, res) {
    const options = {
      uri: `${subscriptionServiceApi}/api/Tenants`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      json: true
    };
    request(options).then((response) => {
      // res.json(response);
      res.render('tenant/list', {
        notificationBar: req.flash('notify'),
        tenants: response
      });
    }).catch((err) => {
      res.json(err);
    });
  },

  getTenant(req, res) {
    const tenantCode = req.params.tenantCode;
    let tenant;
    let quotas;
    const formAction = `/tenant/${tenantCode}/`;
    const getTenantById = {
      uri: `${subscriptionServiceApi}/api/tenants/${tenantCode}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      json: true
    };
    request(getTenantById).then((response) => {
      tenant = response;
      const getQuotas = {
        uri: `${subscriptionServiceApi}/api/Quotas`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${res.accessToken}`
        },
        json: true
      };
      return request(getQuotas);
    }).then((response) => {
      quotas = response;
      // res.json(quotas);
      res.render('tenant/form', {
        tenant,
        quotas,
        formAction,
        title: `Edit tenant - ${tenant.name}`,
        notificationBar: req.flash('notify')
      });
    }).catch((err) => {
      res.json(err);
    });
  },

  updateTenant(req, res) {
    const id = req.params.id;
    const username = req.params.username;
    const tenant = res.tenant;
    const body = req.body;
    body.tenant = tenant;
    body.username = username;
    const adminEndpoint = config.identityServiceAdminApi;
    const options = {
      uri: `${subscriptionServiceApi}/api/users/contacts/${id}`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      body,
      json: true
    };
    request(options).then((response) => {
      req.flash('notify', ['success', 'User has been updated successfully']);
      res.redirect(`/user/${id}/${username}`);
    }).catch((err) => {
      res.json(err);
    });
  },

  deleteTenant(req, res, next) {
    req.flash('notify', ['success', 'This feature is unavailable at the moment']);
    res.redirect('/tenant/list');
    const id = req.params.id;
    const tenantCode = req.params.tenantCode;
    const subscriptionServiceApi = config.subscriptionServiceApi;
    const options = {
      uri: `${subscriptionServiceApi}/api/tenants/${id}/${tenantCode}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      json: true
    };
    request(options).then((response) => {
      req.flash('notify', ['success', 'Tenant has been deleted successfully']);
      res.redirect('/tenant/list');
    }).catch((err) => {
      req.flash('notify', ['error', 'There was an issue when deleting this tenant. Please try again.']);
      res.redirect('/tenant/list');
    });
    // /api/users/unregistrations/537ecb2a-8081-4432-b329-dd65c35fa639/test@pie.net/MAN1
  },

  getCreateTenant(req, res) {
    res.render('tenant/form', {
      title: 'Create tenant',
      createForm: true,
      formAction: '/tenant/create',
      notificationBar: req.flash('notify')
    });
  },

  postCreateTenant(req, res) {
    const body = req.body;
    const options = {
      uri: `${subscriptionServiceApi}/api/tenants`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      body,
      json: true
    };
    request(options).then(() => {
      req.flash('notify', ['success', 'Tenant has been created successfully']);
      res.redirect('/user/list');
    }).catch((err) => {
      req.flash('notify', ['success', err.message]);
      res.redirect('back');
    });
  }
});
