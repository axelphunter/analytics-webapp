// exports
module.exports = (app) => {
  // server-side routing dependencies
  require('../routes/authRoutes')(app);
  require('../routes/indexRoutes')(app);
  require('../routes/userRoutes')(app);
  require('../routes/siteRoutes')(app);
  require('../routes/layoutManagerRoutes')(app);
  require('../routes/tenantRoutes')(app);
  require('../routes/homeRoutes')(app);
};
