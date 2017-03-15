// dependencies
const morgan = require('morgan');

// exports
module.exports = (app) => {
  app.use(morgan('dev'));
};
