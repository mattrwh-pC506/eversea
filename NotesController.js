'use strict';

var NotesService = require('./NotesService.js');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message, "reason": reason});
}

var Notes = new NotesService();

class NotesController {
    constructor(router, db) {
        this.router = router;
        this.db = db;
        this.registerRoutes();
    }
 
    registerRoutes() {
        this.router.get('/notes', this.getNotes.bind(this));
        this.router.get('/notes/:id', this.getSingleNote.bind(this));
        this.router.post('/notes', this.postNote.bind(this));
        this.router.put('/notes/:id', this.putNote.bind(this));
        this.router.delete('/notes/:id', this.deleteNote.bind(this));
    }
 
    getNotes(req, res) {
      Notes.getNotes(req, res, this.db);
    }
 
    getSingleNote(req, res) {
      Notes.getSingleNote(req, res, this.db);
    }
 
    putNote(req, res) {
      Notes.updateNote(req, res, this.db);
    }
 
    postNote(req, res) {
      Notes.addNote(req, res, this.db);
    }

    deleteNote(req, res) {
      Notes.deleteNote(req, res, this.db);
    }
}
 
module.exports = NotesController;
