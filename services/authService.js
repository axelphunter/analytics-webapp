// dependencies
const config = require('config');
const request = require('request');
const rp = require('request-promise');
const schedule = require('node-schedule');
const clientSessionModel = require('../models/clientSessionModel');

// parameters
const client = {
  clientCredentialsFlow: {
    name: config.clientCredentialsFlow.name,
    id: config.clientCredentialsFlow.id,
    secret: config.clientCredentialsFlow.secret,
    scope: config.clientCredentialsFlow.scope,
    ttl: config.clientCredentialsFlow.ttl // 5 minutes
  },
  resourceOwnerFlow: {
    name: config.resourceOwnerFlow.name,
    id: config.resourceOwnerFlow.id,
    secret: config.resourceOwnerFlow.secret,
    scope: config.resourceOwnerFlow.scope,
    ttl: config.resourceOwnerFlow.ttl // 5 minutes
  },
  refreshInterval: config.refreshInterval // 1 minute
};

const authServiceRequestUri = `${config.identityServiceApi.protocol}://${config.identityServiceApi.host}:${config.identityServiceApi.port}`;
const authServiceAdminRequestUri = `${config.identityServiceAdminApi.protocol}://${config.identityServiceAdminApi.host}:${config.identityServiceAdminApi.port}`;

module.exports = {

  requestPasswordResetCredentials(username) {
    const promise = new Promise((resolve, reject) => {
      clientSessionModel
        .findActiveClientSession()
        .then((response) => {
          const accessToken = response.body.accessToken;
          const options = {
            uri: `${authServiceAdminRequestUri}/api/users/credentials/forgotten/${username}`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken.trim()}`
            },
            json: true
          };
          return rp(options);
        })
        .then((response) => {
          const obj = {
            status: 200,
            body: response
          };
          return resolve(obj);
        })
        .catch((err) => {
          return reject(err);
        });
    });
    return promise;
  },

  resetUserPasswordCredentials(username, userId, password, tenant) {
    const promise = new Promise((resolve, reject) => {
      clientSessionModel
        .findActiveClientSession()
        .then((response) => {
          const accessToken = response.body.accessToken;
          const options = {
            uri: `${authServiceAdminRequestUri}/api/users/credentials/updates/${userId}`,
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${accessToken.trim()}`
            },
            body: {
              username,
              password,
              tenant
            },
            json: true
          };
          return rp(options);
        })
        .then((response) => {
          const obj = {
            status: 200,
            body: response
          };
          return resolve(obj);
        })
        .catch((err) => {
          return reject(err);
        });
    });
    return promise;
  },

  requestResourceOwnerAccessToken(username, password) {
    const promise = new Promise((resolve, reject) => {
      let payload = '';
      request
        .post(`${authServiceRequestUri}/connect/token`)
        .form({
          grant_type: 'password',
          client_id: client.resourceOwnerFlow.id,
          client_secret: client.resourceOwnerFlow.secret,
          username: unescape(username),
          password: unescape(password),
          scope: client
            .resourceOwnerFlow
            .scope
            .join(' ')
        })
        .on('response', (res) => {
          res.on('data', (chunk) => {
            payload += chunk;
          });

          res.on('end', () => {
            if (res.statusCode !== 200) {
              const content = JSON.parse(payload);
              let rejection = {};
              let obj = {};

              switch (content.error_description) {
                case 'soft_locked':
                  obj = {
                    status: 400,
                    message: 'This user account has been soft-locked - Contact your administrator'
                  };
                  rejection = reject(obj);
                  break;
                case 'hard_locked':
                  obj = {
                    status: 400,
                    message: 'This user account has been hard-locked - Contact your administrator'
                  };
                  rejection = reject(obj);
                  break;
                case 'account_disabled':
                  obj = {
                    status: 400,
                    message: 'This user account has been disabled'
                  };
                  rejection = reject(obj);
                  break;
                case 'password_reset':
                  break;
                default:
                  obj = {
                    status: 400,
                    message: 'The username or password that was entered is incorrect.'
                  };
                  rejection = reject(obj);
              }
              return rejection;
              // 'soft_locked',
              // 'hard_locked',
              // 'incorrect_credentials',
              // 'account_disabled',
              // 'password_reset',
              // 'incorrect_password',
            }
            return resolve({status: 200, body: payload});
          });
        })
        .on('error', (err) => {
          const errMessage = JSON.stringify(err);
          return reject({status: 500, message: `identity service offline: ${errMessage}`});
        });
    });
    return promise;
  },

  requestClientCredentialsAccessToken(tag) {
    const promise = new Promise((resolve, reject) => {
      let payload = '';

      request
        .post(`${authServiceRequestUri}/connect/token`)
        .form({
          grant_type: 'client_credentials',
          client_id: client.clientCredentialsFlow.id,
          client_secret: client.clientCredentialsFlow.secret,
          scope: client
            .clientCredentialsFlow
            .scope
            .join(' ')
        })
        .on('response', (res) => {
          res.on('data', (chunk) => {
            payload += chunk;
          });

          res.on('end', () => {
            if (res.statusCode !== 200) {
              return reject({status: 400, message: 'unauthorized'});
            }
            return resolve({status: 200, body: payload, tag});
          });
        })
        .on('error', (err) => {
          const errMessage = err.message;
          return reject({status: 500, message: `identity service offline: ${errMessage}`});
        });
    });
    return promise;
  },

  scheduleRequestResourceOwnerAccessTokenRefresh(refreshToken, expiryDateUtc) {
    console.log(`Schedualing userToken expiration for ${expiryDateUtc}`);
    schedule.scheduleJob(expiryDateUtc, () => {
      this.requestResourceOwnerAccessTokenRefresh(refreshToken)
    });
  },

  requestResourceOwnerAccessTokenRefresh(refreshToken, tag) {
    const promise = new Promise((resolve, reject) => {
      let payload = '';

      request
        .post(`${authServiceRequestUri}/connect/token`)
        .form({grant_type: 'refresh_token', client_id: client.resourceOwnerFlow.id, client_secret: client.resourceOwnerFlow.secret, refresh_token: refreshToken})
        .on('response', (res) => {
          res.on('data', (chunk) => {
            payload += chunk;
          });

          res.on('end', () => {
            if (res.statusCode !== 200) {
              return reject({status: 400, message: 'refresh token not valid'});
            }
            return resolve({status: 200, body: payload, tag});
          });
        })
        .on('error', (err) => {
          const errMessage = err.message;
          return reject({status: 500, message: `identity service offline: ${errMessage}`, tag});
        });
    });
    return promise;
  },

  processPayload(payload, tag) {
    const promise = new Promise((resolve, reject) => {
      // payload: raw JSON response from auth server
      // tag: optional (used during cron jobs to pass in/out original _id or jti)

      // parsedPayload: deserialized responsed from auth server (javascript object)
      const parsedPayload = JSON.parse(payload);

      // refrehsToken
      const refreshToken = parsedPayload.refresh_token;

      // encodedAccessToken: Base64 encoded content of property access_token
      const encodedAccessToken = parsedPayload.access_token;

      // encodedAccessTokenPayload: payload of JWT token still in Base64
      const encodedAccessTokenPayload = parsedPayload
        .access_token
        .split('.')[1];

      // decodedAccessTokenPayload: payload of JWT token translated to UTF8, readible as JSON
      const decodedAccessTokenPayload = new Buffer(encodedAccessTokenPayload, 'base64').toString('utf-8');

      // parsedDecodedAccessTokenPayload: decodedAccessTokenPayload deserialized (javascript object)
      const parsedDecodedAccessTokenPayload = JSON.parse(decodedAccessTokenPayload);

      if (parsedDecodedAccessTokenPayload) {
        return resolve({
          status: 200,
          body: {
            encodedAccessToken,
            parsedDecodedAccessTokenPayload,
            refreshToken
          },
          tag
        });
      }
      return reject({status: 500, message: 'decodeJwt error'});
    });
    return promise;
  }
};
