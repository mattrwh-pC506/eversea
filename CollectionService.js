'use strict';
 
var uuid = require('node-uuid');
var mongodb = require("mongodb");
var database = require("./database.js");
var ObjectID = mongodb.ObjectID;
var db;


module.exports = class CollectionService {
    constructor(collection) {
      this.collection = collection;
    }
 
    getCollection(req, res) {
      db = database.getDatabase();
      db.collection(this.collection).find({}).toArray(function(err, docs) {
        if (err) {
          handleError(res, err.message, "Failed to get " + this.collection);
        } else {
          res.status(200).json(docs);
        }
      });
    }
 
    getDoc(req, res) {
      db = database.getDatabase();
      db.collection(this.collection).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to get " + this.collection);
        } else if (!doc){
          handleError(res, "Note does not exist in database!", "Failed to get note.");
        } else {
          res.status(200).json(doc);
        }
      });
    }
 
    addDoc(req, res) {
      db = database.getDatabase();
      var newDoc = req.body;
      newDoc.createDate = new Date();

      if (!req.body) {
        handleError(res, "Invalid user input", "Must add a " + this.collection, 400);
      }

      db.collection(this.collection).insertOne(newDoc, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create new " + this.collection);
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    }
 
    updateDoc(req, res) {
      db = database.getDatabase();
      var updateDoc = req.body;
      delete updateDoc._id;

      db.collection(this.collection).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to update " + this.collection);
        } else {
          res.status(204).end();
        }
      });
    }

    deleteDoc(req, res) {
      db = database.getDatabase();
      db.collection(this.collection).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
        if (err) {
          handleError(res, err.message, "Failed to delete " + this.collection);
        } else {
          res.status(204).end();
        }
      });
    }
}
 
