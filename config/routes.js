//SERVER ROUTES
//===================================================
// https://expressjs.com/en/guide/routing.html
// http://expressjs.com/en/5x/api.html#routing-methods

//import scrape script
var scrape = require("../scripts/scrape");
// import headlines controller
var headlinesController = require("../controllers/headlines");
// import notes controller
var notesController = require("../controllers/notes");

//render the handlebars files
module.exports = function(router) {//SERVER ROUTES
  //render home.handlebars
  router.get("/", function(req, res) {
    res.render("home");
  });
  //render saved.handlebars
  router.get("/saved", function(req, res) {
    res.render("saved");
  });

  router.get("/api/fetch", function(req, res) {

  //go to headlines controller and run fetch
  headlinesController.fetch(function(err, docs) {
      //pop up message to user about added articles
      //if there are no docs returned, set message to "new new articles"
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "No new articles",
        });
      }
      //or set message to alert number of added articles
      else {
        res.json({
          message: "Added " + docs.insertedCount + " new articles"
        });
      }
    });
  });

  // get all headlines from DB
  router.get("/api/headlines", function(req, res) {
    var query = {};
    if (req.query.saved) {
      query = req.query;
    }

    headlinesController.get(query, function(data) {
      res.json(data);
    });
  });

  // delete headline
  router.delete("/api/headlines/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;

    headlinesController.delete(query, function(err, data) {
      res.json(data);
    });
  });

  // update headline
  router.patch("/api/headlines", function(req, res) {

    headlinesController.update(req.body, function(err, data) {
      res.json(data);
    });
  });
  // get note
  router.get("/api/notes/:headline_id?", function(req, res) {
    var query = {};
    if (req.params.headline_id) {
      query._id = req.params.headline_id;
    }

    notesController.get(query, function(err, data) {
      res.json(data);
    });
  });

  // delete note
  router.delete("/api/notes/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;

    notesController.delete(query, function(err, data) {
      res.json(data);
    });
  });

  //add note
  router.post("/api/notes", function(req, res) {
    notesController.save(req.body, function(data) {
      res.json(data);
    });
  });
};
