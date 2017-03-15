const _ = require('underscore');
module.exports = {
  name: 'base',
  extend(child) {
    return _.extend({}, this, child);
  },
  run(req, res, next) {}
}
