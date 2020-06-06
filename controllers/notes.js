var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
  get: function(data, cb) {
    // find all notes with headline's id
    Note.find({
      _headlineId: data._id
    }, cb);
  },
  // save a note
  save: function(data, cb) {
    var newNote = {
      _headlineId: data._id,
      noteText: data.noteText
    };

    Note.create(newNote, function(err, doc) {
      if (err) {
        console.log("There was an error: " + err);
      }
      else {
        console.log(doc);
        cb(doc);
      }
    });
  },
  delete: function(data, cb) {
    // remove a note
    Note.remove({
      _id: data._id
    }, cb);
  }
};