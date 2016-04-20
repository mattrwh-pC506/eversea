'use strict';
 
var uuid = require('node-uuid');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

class NotesService {
    constructor() {}
 
    getNotes(req, res, db) {
      db.collection("notes").find({}).toArray(function(err, docs) {
        if (err) {
          handleError(res, err.message, "Failed to get notes.");
        } else {
          res.status(200).json(docs);
        }
      });
    }
 
    getSingleNote(req, res, db) {
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
 
    addNote(req, res, db) {
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
 
    updateNote(req, res, db) {
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

    deleteNote(req, res, db) {
      db.collection("notes").deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
        if (err) {
          handleError(res, err.message, "Failed to delete note.");
        } else {
          res.status(204).end();
        }
      });
    }
}
 
module.exports = new NotesService();
