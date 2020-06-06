var scrape = require("../scripts/scrape");
var balanceText = require("../scripts/balancetext");
var Headline = require("../models/Headline");

module.exports = {
  fetch: function(cb) {

    // scrape function
    scrape(function(data) {
      
      var articles = data;
      // each article has a date
      for (var i = 0; i < articles.length; i++) {
        articles[i].saved = false;
      }
      // headline.collection lets us access the native Mongo insertMany method.
      Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
        cb(err, docs);
      });
    });
  },
  delete: function(query, cb) {
    Headline.remove(query, cb);
  },
  get: function(query, cb) {
    // sorted by id
    Headline.find(query)
      .sort({
        // sort by date, by most recent
        date: - 1
      })
      // execute this query
      .exec(function(err, doc) {
        cb(doc);
      });
  },
  update: function(query, cb) {
    // update the headline with id 
    Headline.update({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
};
