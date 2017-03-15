const mongoose = require('mongoose');
const config = require('config');

const clientSessionSchema = mongoose.Schema({
  jti: String,
  clientName: String,
  clientId: String,
  accessToken: String,
  startDateUtc: Date,
  lastRefreshDateUtc: Date,
  lastActivityDateUtc: Date,
  expiryDateUtc: Date
}, {strict: false});

const ClientSession = mongoose.model('ClientSession', clientSessionSchema);

module.exports = {

  findActiveClientSession() {
    // TODO Make sure client sessions are removed before querying for current active session.
    const promise = new Promise((resolve, reject) => {
      ClientSession.findOne({
        clientId: config.clientCredentialsFlow.id
      }, (err, entity) => {
        if (err) {
          return reject({status: 500, err});
        }
        return resolve({status: 200, body: entity});
      });
    });
    return promise;
  },

  findClientSession(id, jti, clientName) {
    const promise = new Promise((resolve, reject) => {
      ClientSession.findOne({
        _id: id,
        jti,
        clientName
      }, (err, entity) => {
        if (err) {
          return reject({status: 500, err});
        }
        return resolve({status: 200, body: entity});
      });
    });
    return promise;
  },

  removeClientSession(id) {
    const promise = new Promise((resolve, reject) => {
      ClientSession.remove({
        _id: id
      }, (err) => {
        if (err) {
          console.log(`unable to remove expired client session with id: ${id}`);
          console.log(err);
          return reject({status: 500, err});
        }
        console.log(`removed client session with id: ${id}`);
        return resolve({status: 200});
      });
    });
    return promise;
  },

  createClientSession(encodedAccessToken, parsedDecodedAccessTokenPayload) {
    const promise = new Promise((resolve, reject) => {
      const now = Date.now();
      const expiryDateUtc = parsedDecodedAccessTokenPayload.exp * 1000;

      ClientSession.find({
        clientName: 'pie-mt'
      }, (err, entities) => {
        if (err) {
          console.log('unable to communicate with db and check existing client sessions');
          return reject({status: 500, err, message: 'unable to communicate with db and check existing client sessions'});
        }
        const sessions = [];
        for (let i = 0; i < entities.length; i++) {
          sessions.push(this.removeClientSession(entities[i]._id));
        }
        Promise
          .all(sessions)
          .then(() => {
            console.log('All sessions removed');
          })
          .catch(() => {
            console.log('One or more sessions failed to remove. aborting process.');
          });

        return ClientSession.create({
          jti: parsedDecodedAccessTokenPayload.jti,
          clientName: 'pie-mt',
          clientId: parsedDecodedAccessTokenPayload.client_id,
          accessToken: encodedAccessToken,
          startDateUtc: now,
          lastRefreshDateUtc: now,
          lastActivityDateUtc: now,
          expiryDateUtc
        }, (err, entity) => {
          if (err) {
            return reject({status: 500, err});
          }
          return resolve({status: 200, body: entity, expires: expiryDateUtc});
        });
      });
    });
    return promise;
  },

  findClientSessionsThatHaveExpired() {
    const promise = new Promise((resolve, reject) => {
      const now = new Date();

      ClientSession.find({
        expiryDateUtc: {
          $lte: now.getTime()
        }
      }, (err, entities) => {
        if (err) {
          return reject({status: 500, err});
        }
        return resolve({status: 200, body: entities});
      });
    });
    return promise;
  }

};
