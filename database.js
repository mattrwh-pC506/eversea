'use strict';
 
var db;

class Database {
  constructor() {}

  addDatabase(_db) {
    if (!db) {
      db = _db;
    } else {
      console.log("Database connection already opened!!");
    }
  }

  getDatabase() {
    return db;
  }

}

module.exports = new Database();
