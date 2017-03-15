// dependencies
const baseController = require('./baseController');
const authService = require('../services/authService');
const notificationService = require('../services/notificationService');
const userSessionSchedulerService = require('../services/userSessionSchedulerService');
const redis = require('redis');
const redisClient = redis.createClient();

module.exports = baseController.extend({

  name: 'Auth',

  logIn(req, res) {
    const session = req.session;
    const username = req.body.username;
    const password = req.body.password;
    // const stayLogged = req.body.stayLogged;
    const stayLogged = null;

    if (!username || !password) {
      return res
        .status(400)
        .end('You must provide credentials.');
    }

    return authService
      .requestResourceOwnerAccessToken(username, password)
      .then((response) => {
        const body = response.body;
        return authService.processPayload(body, null);
      })
      .then((response) => {
        const encodedAccessToken = response.body.encodedAccessToken;
        const parsedDecodedAccessTokenPayload = response.body.parsedDecodedAccessTokenPayload;
        const refreshToken = response.body.refreshToken;

        // Create session
        session.user = {
          jti: parsedDecodedAccessTokenPayload.jti,
          uid: parsedDecodedAccessTokenPayload.userId,
          username: parsedDecodedAccessTokenPayload.sub,
          firstname: parsedDecodedAccessTokenPayload.firstName,
          lastname: parsedDecodedAccessTokenPayload.lastName,
          role: parsedDecodedAccessTokenPayload.role,
          superAdmin: parsedDecodedAccessTokenPayload.superAdmin,
          tenant: parsedDecodedAccessTokenPayload.tenant
        };

        if (stayLogged) {
          session.cookie.expires = false;
        }
        const sessionObj = {
          refreshToken,
          encodedAccessToken,
          ttl: parsedDecodedAccessTokenPayload.exp * 1000,
          tenant: parsedDecodedAccessTokenPayload.tenant,
          lastActive: stayLogged ?
            new Date(Date.now()) : null
        };
        // Create Reddis key value.
        redisClient.set(parsedDecodedAccessTokenPayload.jti, JSON.stringify(sessionObj), (err, reply) => {
          if (err) {
            throw new Error('Could not set redis key value.');
          }
          if (!sessionObj.lastActive) {
            userSessionSchedulerService.longLiveSession(parsedDecodedAccessTokenPayload.jti);
          }
          req.flash('notify', ['success', 'You have been logged in successfully']);
          const obj = {
            message: 'You have been logged in successfully'
          };
          return res.json(obj);
        });
      })
      .catch((error) => {
        console.log(error);
        session.user = null;
        const errMessage = error.message;
        return res
          .status(302)
          .end(errMessage);
      });
  },

  logOut(req, res) {
    const session = req.session;
    if (session.user) {
      if (session.user.jti) {
        redisClient.del(session.user.jti, (err, reply) => {
          if (err) {
            console.log(err);
          }
          console.log(reply);
        });
      }
      session.user = null;
    }
    req.flash('notify', ['success', 'You have been logged out successfully']);
    return res.redirect(302, '/');
  },

  forgotPassword(req, res) {
    const session = req.session;
    const username = req.body.username || session.verification.username || null;

    if (!req.body.resend && !username) {
      return res
        .status(400)
        .end('You must provide credentials.');
    } else if (req.body.resend && !username) {
      return res
        .status(400)
        .end('The password reset session has expired. Please follow password reset steps again in order to reset your password.');
    }

    const method = req.body.method || null;
    return authService
      .requestPasswordResetCredentials(username)
      .then((response) => {
        const responseBody = response.body;
        return notificationService.twoFactorAuth(responseBody, method);
      })
      .then((response) => {
        session.verification = {
          userId: response.userId,
          authCode: response.authCode,
          username: response.username,
          tenant: response.tenant,
          verified: false
        };
        const resObj = {
          message: 'success'
        };
        return res.json(resObj);
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .end('The username that was entered is incorrect.');
      });
  },

  verifyAuthCode(req, res) {
    if (!req.body.authCode) {
      return res
        .status(400)
        .end('You must provide and Authorisation code.');
    }

    const authCode = parseInt(req.body.authCode, 10);
    const authSession = req.session.verification;
    if (authSession.authCode === authCode) {
      authSession.verified = true;
      return res.json({
        status: 200,
        verified: true
      });
    }
    return res
      .status(400)
      .end('That Authorisation code was incorrect.');
  },

  resetUserPassword(req, res) {
    const authSession = req.session.verification;
    if (!authSession.verified) {
      return res
        .status(400)
        .end('Request unavailable, authorisation code not verified.');
    }

    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if (!password || !passwordConfirm) {
      return res
        .status(400)
        .end('You must provide a new password.');
    }

    if (password !== passwordConfirm) {
      return res
        .status(400)
        .end('Passwords entered do not match');
    }

    if (!password.match(/(?=^.{8,15}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=(.*\d){1,}))((?!.*[",;&|'])|(?=(.*\W){1,}))(?!.*[",;&|'])^.*$/)) {
      return res
        .status(400)
        .end('Password must have at least 8 characters and maximum of 15 characters with at least one Capital letter, at least one lower case letter and at least one number.');
    }

    const username = authSession.username;
    const userId = authSession.userId;
    const tenant = authSession.tenant;
    req.session.verification = null;

    authService
      .resetUserPasswordCredentials(username, userId, password, tenant)
      .then(() => {
        req.flash('notify', ['success', 'Your password has been reset successfully']);
        return res.json({
          status: 200,
          message: 'success'
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .end(err);
      });
  }

});
