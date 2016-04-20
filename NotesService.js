'use strict';
 
var uuid = require('node-uuid');
var mongodb = require("mongodb");
var database = require("./database.js");
var ObjectID = mongodb.ObjectID;
var db;

function addDb(func, arguments) {
  return function decorator() {
    func.db = database.getDatabase();
    func.apply(this, arguments);
  }
}

class NotesService {
    constructor() {}
 
    getNotes(req, res) {
      db = database.getDatabase();
      db.collection("notes").find({}).toArray(function(err, docs) {
        if (err) {
          handleError(res, err.message, "Failed to get notes.");
        } else {
          res.status(200).json(docs);
        }
      });
    }
 
    getSingleNote(req, res) {
      db = database.getDatabase();
      db.collection("notes").findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to get note.");
        } else if (!doc){
          handleError(res, "Note does not exist in database!", "Failed to get note.");
        } else {
          res.status(200).json(doc);
        }
      });
    }
 
    addNote(req, res) {
      db = database.getDatabase();
      var newNote = req.body;
      newNote.createDate = new Date();

      if (!req.body.note) {
        handleError(res, "Invalid user input", "Must add a note.", 400);
      }

      db.collection("notes").insertOne(newNote, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create new note.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    }
 
    updateNote(req, res) {
      db = database.getDatabase();
      var updateDoc = req.body;
      delete updateDoc._id;

      db.collection("notes").updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to update note.");
        } else {
          res.status(204).end();
        }
      });
    }

    deleteNote(req, res) {
      db = database.getDatabase();
      db.collection("notes").deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
        if (err) {
          handleError(res, err.message, "Failed to delete note.");
        } else {
          res.status(204).end();
        }
      });
    }
}

 
module.exports = NotesService;
