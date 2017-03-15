"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LayoutSchemaSchema = mongoose.Schema({
  uid: String
}, {
  strict: false
});

module.exports = mongoose.model('LayoutSchema', LayoutSchemaSchema);
