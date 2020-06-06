//controller for notes (CRUD functionality)
//===================================================

// require Note model
var Note = require("../models/Note");

module.exports = {
  // GET THE NOTES
  get: function(data, cb) {
    // find all the notes associated with the document id
    Note.find({
      _headlineId: data._id
    }, cb);
  },
    
    // SAVE FUNCTION FOR THE NOTE
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

  //DELETE A NOTE
  delete: function(data, cb) {
    //delete the note with the associated id
    Note.deleteOne({
      _id: data._id
    }, cb);
  }
};