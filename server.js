var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var NOTES_COLLECTION = "notes";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
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
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


// API ROUTES BELOW
// Generic error handler used by all endpoints.

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}


/* "/notes"
 * GET: lists all notes
 * POST: creates a new note
 * {
    "_id": <ObjectId>,
    "note": <string>,
  }
 */

app.get("/notes", function(req, res) {
  db.collection(NOTES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get notes.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/notes", function(req, res) {
  var newNote = req.body;
  newNote.createDate = new Date();

  if (!req.body.note) {
    handleError(res, "Invalid user input", "Must add a note.", 400);
  }

  db.collection(NOTES_COLLECTION).insertOne(newNote, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new note.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/notes/:id"
 *    GET: find note by id
 *    PUT: update note by id
 *    DELETE: deletes note by id
 */

app.get("/notes/:id", function(req, res) {
  db.collection(NOTES_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get note.");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/notes/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(NOTES_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update note.");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/notes/:id", function(req, res) {
  db.collection(NOTES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete note.");
    } else {
      res.status(204).end();
    }
  });
});

