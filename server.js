//require dependencies
var bodyParser = require("body-parser");
var express = require("express");
// Using Node.js `require()`
const mongoose = require("mongoose");
  //to circumvent deprecation warnings
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useCreateIndex', true);
  var expressHandlebars = require("express-handlebars");

//set up port -- deployed port or localhost 3000
var PORT = process.env.PORT || 2525;

//app instance
var app = express();

//set up express router
var router = express.Router();

app.use(bodyParser.urlencoded({
  extended: false
}));

//require routes through router
require("./config/routes")(router);

//use the static directory: /public
app.use(express.static(__dirname + "/public"));

//connect handlebars to express
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//set view engine to handlebars
app.use(bodyParser.urlencoded({
  extended: false
}));

//middleware
app.use(router);

// If deployed, use the deployed database. Otherwise, use the local 'ringerHeadlines' database.
var db = process.env.MONGODB_URI || "mongodb://localhost/ringerHeadlines";

//tell mongoose to connect to the database
mongoose.connect(db, function(error) {
  if (error) {
    //log any errors to the console
    console.log("There was an error: + " + error);
  }
  else {
    //or log a success message to the console
    console.log("Mongoose connection created successfully.");
  }
});

//listen on the PORT
app.listen(PORT, function() {
  console.log("Listening on port: http://localhost:" + PORT);
});
