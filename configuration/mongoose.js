const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = (config) => {
  // db connection
  mongoose.connect(config.mongo.db);
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDb conneciton error'));
  db.once('open', function callback() {
    console.log('MongoDb listening on port TCP/27017...');
    console.log('MongoDb database online...');
  });

  // enable mongoose debuging to console
  // mongoose.set('debug', true);

  // warmup schemas
  const quotaSchema = mongoose.Schema({property: String, value: String});

  const subscriptionSchema = mongoose.Schema({feature: String, fromUtc: Date, toUtc: Date, quotas: [quotaSchema]});

  const tenantSchema = mongoose.Schema({code: String, name: String, subscriptions: [subscriptionSchema]});

  // models
  const Tenant = mongoose.model('Tenant', tenantSchema);

};
