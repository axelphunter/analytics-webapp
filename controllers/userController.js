const baseController = require('./baseController');
const request = require('request-promise');
const config = require('config');
const generatePassword = require('generate-password');

module.exports = baseController.extend({
  name: 'User',

  getUserList(req, res) {
    const adminEndpoint = config.identityServiceAdminApi;
    const options = {
      uri: `${adminEndpoint.protocol}://${adminEndpoint.host}:${adminEndpoint.port}/api/Users`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      json: true
    };
    request(options).then((response) => {
      res.json(response);
    }).catch((err) => {
      res.json(err);
    });
  },

  getUser(req, res) {
    const id = req.params.id;
    const username = req.params.username;
    const tenant = res.tenant;
    const adminEndpoint = config.identityServiceAdminApi;
    const options = {
      uri: `${adminEndpoint.protocol}://${adminEndpoint.host}:${adminEndpoint.port}/api/Users/${username}/${tenant}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      json: true
    };
    request(options).then((response) => {
      res.json(response);
    }).catch((err) => {
      res.json(err);
    });
  },

  updateUser(req, res) {
    const id = req.params.id;
    const username = req.params.username;
    const tenant = res.tenant;
    const body = req.body;
    body.tenant = tenant;
    body.username = username;
    const adminEndpoint = config.identityServiceAdminApi;
    const options = {
      uri: `${adminEndpoint.protocol}://${adminEndpoint.host}:${adminEndpoint.port}/api/users/contacts/${id}`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      body,
      json: true
    };
    request(options).then(() => {
      res.send(200);
    }).catch(() => {
      res.send(500);
    });
  },

  deleteUser(req, res) {
    const id = req.params.id;
    const username = req.params.username;
    const tenant = res.tenant;
    const adminEndpoint = config.identityServiceAdminApi;
    const options = {
      uri: `${adminEndpoint.protocol}://${adminEndpoint.host}:${adminEndpoint.port}/api/users/unregistrations/${id}/${username}/${tenant}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      json: true
    };
    request(options).then(() => {
      res.send(200);
    }).catch(() => {
      res.send(500);
    });
  },

  postCreateUser(req, res) {
    const tenant = res.tenant;
    const body = req.body;
    body.tenant = tenant;
    body.password = generatePassword.generate({length: 8, numbers: true, symbols: true, uppercase: true});
    const adminEndpoint = config.identityServiceAdminApi;
    const options = {
      uri: `${adminEndpoint.protocol}://${adminEndpoint.host}:${adminEndpoint.port}/api/users/registrations`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${res.accessToken}`
      },
      body,
      json: true
    };
    request(options).then(() => {
      res.send(200);
    }).catch(() => {
      res.send(500);
    });
  }
});
