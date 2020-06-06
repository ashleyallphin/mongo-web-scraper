var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 2525;

var app = express();
var router = express.Router();
require("./config/routes")(router);

app.use(express.static(__dirname + "/public"));

// handlebars
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(router);


var db = process.env.MONGODB_URI || "mongodb://localhost/ringerHeadlines";

mongoose.connect(db, function(error) {
  if (error) {
    console.log("There was an error: + " + error);
  }
  else {
    console.log("Mongoose connection created successfully.");
  }
});

app.listen(PORT, function() {
  console.log("Listening on port: http://localhost:" + PORT);
});
