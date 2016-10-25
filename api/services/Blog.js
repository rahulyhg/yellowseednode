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
       ref: 'Tag',
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

schema.plugin(deepPopulate, {
  populate:{
    'tags':{
      select:" _id name"
    }
  }

});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Blog', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,'tags','tags'));
var model = {

  getOneBlog: function(data, callback) {
          var newreturns = {};
          newreturns.blog = [];
          newreturns.related = [];
          this.findOne({
              "_id": data._id
          }).populate("tags", "_id name").exec(function(err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else {
                // console.log(found);
                  newreturns.blog = found;
                  if (found && found.tags) {
                      Blog.find({
                          tags: {
                              $in: found.tags
                          },
                          _id: {
                              $nin: found._id
                          }
                      }).limit(3).exec(function(err, data2) {
                          if (err) {
                              console.log(err);
                              callback(err, null);
                          } else {
                              newreturns.related = data2;
                              callback(null, newreturns);
                          }
                      });
                  } else {
                      callback(null, newreturns);
                  }
              }
          });
      },


};
module.exports = _.assign(module.exports, exports, model);
