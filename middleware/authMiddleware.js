const redis = require('redis');
const authService = require('../services/authService');
const redisClient = redis.createClient();

module.exports = {
  checkAuthSession(req, res, next) {
    const session = req.session;
    if (!session || !session.user || !session.user.jti) {
      console.log('No current session');
      return res.redirect('/auth/logout');
    }
    const jti = session.user.jti;
    redisClient.get(jti, (err, reply) => {
      if (err) {
        console.log(err);
        return res.redirect('/auth/logout');
      }

      const payload = JSON.parse(reply);
      res.tenant = payload.tenant;
      const refreshToken = payload.refreshToken;

      authService
        .requestResourceOwnerAccessTokenRefresh(refreshToken, jti)
        .then((response) => {
          const body = response.body;
          return authService.processPayload(body, jti);
        })
        .then((response) => {
          res.accessToken = response.body.encodedAccessToken;
          payload.encodedAccessToken = res.accessToken;
          payload.refreshToken = response.body.refreshToken;
          payload.lastActive = new Date(Date.now());
          redisClient.set(jti, JSON.stringify(payload), (err, reply) => {
            if (err) {
              throw new Error('Could not set redis key value.');
            }
            next();
          });
        })
        .catch((err) => {
          console.log(err);
          return res.redirect('/auth/logout');
        })
    });
  }
};
