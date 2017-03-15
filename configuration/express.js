// dependencies
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const mongoConnect = {
  mongooseConnection: mongoose.connection
};
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const helmet = require('helmet');

// exports
module.exports = (app, config) => {
  // view engine configuration

  // app.engine('.hbs', exphbs({
  //   defaultLayout: 'main',
  //   extname: '.hbs',
  //   layoutsDir: path.join(config.rootPath, '/views/layouts'),
  //   partialsDir: path.join(config.rootPath, '/views/partials'),
  //   helpers: handlebarsHelpers
  // }));
  // app.set('view engine', '.hbs');

  // session configuration
  const sessionConfig = {
    store: new MongoStore(mongoConnect),
    secret: config.mongoStore.secret,
    resave: false,
    saveUninitialized: false
  };

  // app paths
  const appPaths = {
    js: path.resolve(config.rootPath, 'js'),
    css: path.resolve(config.rootPath, 'css'),
    fonts: path.resolve(config.rootPath, 'fonts'),
    images: path.resolve(config.rootPath, 'images'),
    bower_components: path.resolve(config.rootPath, 'bower_components'),
    json: path.resolve(config.rootPath, 'json')
  };

  // static options
  const staticOpts = {
    etag: config.debugMode,
    lastModified: config.debugMode,
    maxAge: 0
  };

  // express config
  app
    .set('views', path.join(config.rootPath, '/views'))
    .set('view engine', 'pug')
    .use(bodyParser.urlencoded({
      extended: true
    }))
    .use(bodyParser.json())
    .use(cookieParser())
    .use(flash())
    .use(session(sessionConfig))
    .use(passport.initialize())
    .use(passport.session())
    .use(helmet())
    .use('/js', express.static(appPaths.js, staticOpts))
    .use('/css', express.static(appPaths.css, staticOpts))
    .use('/fonts', express.static(appPaths.fonts, staticOpts))
    .use('/images', express.static(appPaths.images, staticOpts))
    .use('/bower_components', express.static(appPaths.bower_components, staticOpts))
    .use('/json', express.static(appPaths.json, staticOpts));
};
