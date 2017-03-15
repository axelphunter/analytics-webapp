require('babel-core/register')
// dependencies
const appRoot = require('app-root-path');
const path = require('path');
const express = require('express');

// environment configuration
const config = require('config');
config.rootPath = path.join(appRoot.path, config.rootPath)
// const configuration = require('./configuration/config')(env);

// express config
const app = express();
require('./configuration/express')(app, config);

// logger config
require('./configuration/logger')(app);

// mongoose config
// require('./config/mongodb')(config);
require('./configuration/mongoose')(config);

// routing config
require('./configuration/routing')(app);

// client access config
require('./configuration/client')(app, config);

// user session scheduler
// require('./configuration/userSessionScheduler')(config);

// server
app.listen(config.port, () => {
  console.log(config.mongo.db);
  console.log(`${config.mode} - NodeJS Server listening on port TCP/${config.port}...`);
});
