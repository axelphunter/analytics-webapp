const config = require('config');
const twilioClient = require('twilio')(config.twilio.sid, config.twilio.authToken);
const emailjs = require('emailjs/email');
// var resp = new twilio.TwimlResponse();
//
// resp.say('Welcome to Twilio!');
// resp.say('Please let us know if we can help during your development.', {
//   voice: 'woman',
//   language: 'en-gb'
// });

// console.log(resp.toString());

module.exports = {

  twoFactorAuth(userPayload, method) {
    const promise = new Promise((resolve, reject) => {
      const randomAuthCode = Math.floor(Math.random() * 900000) + 100000;
      switch (method) {
        case 'email':
          const username = userPayload.username;
          const text = `${randomAuthCode} is your PIE authentication code.`;
          this
            .emailUser(username, null, null, 'PIE authentication code', body)
            .then(() => {
              resolve({userId: userPayload.id, authCode: randomAuthCode, username: userPayload.username, tenant: userPayload.tenant});
            })
            .catch((err) => {
              reject(err);
            });
          break;
        default:
          const phone = userPayload.phone;
          const body = `${randomAuthCode} is your PIE authentication code.`;
          this
            .smsUser(phone, body)
            .then((response) => {
              resolve({userId: userPayload.id, authCode: randomAuthCode, username: userPayload.username, tenant: userPayload.tenant});
            })
            .catch((err) => {
              reject(err);
            });
      }
    });
    return promise;
  },

  smsUser(to, body) {
    const promise = new Promise((resolve, reject) => {
      const phoneOptions = {
        to,
        from: config.twilio.phoneNumber,
        body
      };

      twilioClient
        .sendMessage(phoneOptions)
        .then((repsonse) => {
          return resolve(repsonse);
        })
        .catch((err) => {
          return reject(err);
        });
    });
    return promise;
  },

  emailUser(to, cc, bcc, subject, text, html) {
    const promise = new Promise((resolve, reject) => {

      const emailServerOpts = {
        user: config.email.credentials.username,
        password: config.email.credentials.password,
        host: config.email.SMTP.server,
        tls: {
          ciphers: 'SSLv3'
        }
      };
      const emailServer = emailjs
        .server
        .connect(emailServerOpts);

      emailServer.send({
        text,
        from: `${config.email.credentials.username} <${config.email.credentials.username}>`,
        to: `${to} <${to}>`,
        subject
      }, (err, message) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log(message);
        return resolve(message);
      });
    });
    return promise;
  }

};
