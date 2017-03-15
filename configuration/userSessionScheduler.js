// dependencies
const CronJob = require('cron').CronJob;
const authService = require('../services/authService');
const userSessionModel = require('../models/userSessionModel');

module.exports = () => {
  // scheduler job definition: refresh user tokens
  new CronJob('*/30 * * * * * ', () => {
    userSessionModel
      .findUserSessionsAboutToExpire(300)
      .then((response) => {
        const entities = response.body;
        console.log(`found ${entities.length} user sessions to refresh`);
        const userSessions = [];
        if (!entities) {
          return;
        }
        entities.forEach((entitity) => {
          const tag = entitity._id;
          const token = entitity.refreshToken;
          userSessions.push(authService.requestResourceOwnerAccessTokenRefresh(token, tag));
        });
        Promise.all(userSessions);
      })
      .then((response) => {
        const payloads = [];
        response.forEach((res) => {
          const payload = res.body;
          const tag = res.tag;
          payloads.push(authService.processPayload(payload, tag));
        });

        return Promise.all(payloads);
      })
      .then((response) => {
        const userSessions = [];
        response.forEach((payload) => {
          const encodedAccessToken = payload.body.encodedAccessToken;
          const parsedDecodedAccessTokenPayload = payload.body.parsedDecodedAccessTokenPayload;
          const refreshToken = payload.body.refreshToken;
          const tag = payload.tag;
          userSessions.push(userSessionModel.refreshUserSession(encodedAccessToken, parsedDecodedAccessTokenPayload, refreshToken, tag));
        });
        return Promise.all(userSessions);
      })
      .then((response) => {
        response.forEach((user) => {
          const tag = user.tag;
          console.log(`userSession with _id tag: ${tag} refreshed`);
        });
      })
      .catch((err) => {
        console.log(`error: ${err}`);
      });
  }, null, false, 'UTC').start();

  // scheduler job definition: remove expired user tokens
  new CronJob('0 */2 * * * * ', () => {
    userSessionModel
      .findUserSessionsThatHaveExpired()
      .then((response) => {
        const entities = response.body;
        const userSessions = [];
        console.log(`found ${entities.length} expired user sessions to remove`);
        entities.forEach((entity) => {
          const id = entity._id;
          userSessions.push(userSessionModel.removeUserSession(id));
        });
        return Promise.all(userSessions);
      })
      .then(() => {
        console.log('All user sessions have been removed.');
      })
      .catch((err) => {
        console.log(`error: ${err}`);
      });
  }, null, false, 'UTC').start();

  // scheduler job start
};
