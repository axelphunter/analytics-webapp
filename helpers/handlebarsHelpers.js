const moment = require('moment');

module.exports = {
  stringify(object) {
    return JSON.stringify(object);
  },
  format(date) {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
  }
};
