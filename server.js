'use strict';

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var NotesController = require('./NotesController.js');
var NotesService = require('./NotesService.js');
var _database = require('./database.js');

var NOTES_COLLECTION = "notes";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db, db_url;
var buildMongodbUrl = function() {
  if (process.env.ENV == "dev") {
    db_url = "mongodb://localhost:27017/eversea";
  } else {
    db_url = process.env.MONGODB_URI;
  }
  return db_url;
}

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(buildMongodbUrl(), function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = _database.addDatabase(database);
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

  // API ROUTES BELOW
  // Generic error handler used by all endpoints.

  var apiRouter = express.Router();

  app.use('/api/v1', apiRouter);

  var nc = new NotesController(apiRouter, db);
});




