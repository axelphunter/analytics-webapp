// dependencies
const authService = require('../services/authService');
const clientSessionModel = require('../models/clientSessionModel');
const schedule = require('node-schedule');

// exports
module.exports = () => {
  const scheduleClientCredentialsAccesstokenRefresh = (expiryDate) => {
    const promise = new Promise((resolve) => {
      console.log(`Schedualing client expiration for ${expiryDate}`);
      schedule.scheduleJob(expiryDate, () => {
        resolve();
      });
    });
    return promise;
  };
  // function to request a client token
  const requestClientCredentialsAccesstoken = () => {
    authService
      .requestClientCredentialsAccessToken(null)
      .then((response) => {
        const payload = response.body;
        const tag = response.tag;
        return authService.processPayload(payload, tag);
      })
      .then((response) => {
        const encodedAccessToken = response.body.encodedAccessToken;
        const parsedDecodedAccessTokenPayload = response.body.parsedDecodedAccessTokenPayload;
        return clientSessionModel.createClientSession(encodedAccessToken, parsedDecodedAccessTokenPayload);
      })
      .then((response) => {
        const entityId = response.body._id;
        console.log(`Stored client session in db. _id: ${entityId}`);
        const expiryDate = new Date(response.expires);
        return scheduleClientCredentialsAccesstokenRefresh(expiryDate);
      })
      .then(() => {
        requestClientCredentialsAccesstoken();
      })
      .catch((err) => {
        console.log(`error storing client credentials in db: ${err}`);
      });
  };
  // call that function as soon as server comes up
  requestClientCredentialsAccesstoken();
};
