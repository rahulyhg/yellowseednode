var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
var objectid = require("mongodb").ObjectId;
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
  name: {
       type: String,
       default: " "
   },

   image: {
       type: String,
       default: ""
   },

   banner: {
     type: String,
     default: " "
   },

   date: {
        type: Date,
        default: Date.now()
    },

   tags: [{
       type: Schema.Types.ObjectId,
       ref: 'Tags',
       index: true
   }],

   content: {
       type: String,
       default: ""

   },

   order: {
     type: Number,
     default: 0
   },

   status: {
     type: String,
     enum: ["true", "false"]
   }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Blog', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
