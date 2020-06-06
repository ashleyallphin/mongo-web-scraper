//controller for headline (CRUD functionality)
//===================================================

//bring in scrape script
var scrape = require("../scripts/scrape");
//bring in Headline model
var Headline = require("../models/Headline");
var balanceText = require("../scripts/balancetext");


module.exports = {
  
  //FETCH ARTICLES and insert them into the headline collection in the Mongo db
  fetch: function(cb) {
    //run scrape function
    scrape(function(data) {
      var articles = data;
      //set saved to false
      for (var i = 0; i < articles.length; i++) {
        articles[i].saved = false;
      }
      //mongo function to insert articles into database
      Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
        cb(err, docs);
      });
    });
  },
  
  //DELETE ARTTICLE
  delete: function(query, cb) {
    Headline.deleteOne(query, cb);
  },

  //GET METHOD to get articles from the db
  get: function(query, cb) {
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

  // UPDATE ARTICLES
  update: function(query, cb) {
    // update the headline with id 
    Headline.updateOne({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
};
