const schedule = require('node-schedule');
const authService = require('../services/authService');
const redis = require('redis');
const redisClient = redis.createClient();

module.exports = {
  longLiveSession(jti) {
    redisClient.get(jti, (err, reply) => {
      if (err) {
        console.log('Session expired');
      } else {
        const response = JSON.parse(reply);
        const jobSchedule = new Date(response.ttl - 60000);
        console.log(`Schedualing session check at ${jobSchedule}`);
        schedule.scheduleJob(jobSchedule, () => {});
      }

    });
  },
  schedualeTokenRefresh(refreshToken, jti) {
    const self = this;
    const promise = new Promise((resolve, reject) => {
      console.log(`Schedualing session check at ${new Date(Date.now() + userSession.maxAge)}`);
      schedule.scheduleJob(new Date(Date.now() + userSession.maxAge), () => {
        console.log('Checking if session is still live');
        if (!userSession || userSession.lastActive + userSession.cookie.expires < userSession.cookie.expires) {
          userSessionModel
            .removeUserSession(userSession._id)
            .then((respose) => {
              userSession = null;
              console.log('Session expired');
            })
            .catch(() => {
              console.log('Error refreshing token');
            });
          return;
        }

        authService
          .requestResourceOwnerAccessTokenRefresh(userSession.refreshToken, userSession._id)
          .then((response) => {
            const payload = response.body;
            const tag = response.tag;
            return authService.processPayload(payload, tag);
          })
          .then((response) => {
            const encodedAccessToken = response.body.encodedAccessToken;
            const parsedDecodedAccessTokenPayload = response.body.parsedDecodedAccessTokenPayload;
            const refreshToken = response.body.refreshToken;
            const tag = response.tag;
            return userSessionModel.refreshUserSession(encodedAccessToken, parsedDecodedAccessTokenPayload, refreshToken, tag);
          })
          .then((response) => {
            console.log('All good, refreshing token');
            userSession.cookie.expires = new Date(Date.now() + (userSession.maxAge + 20000));
            userSession.refreshToken = response.refresh_token;
            console.log(userSession);
            self.schedualeTokenRefresh(userSession);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
    return promise;
  }
}
