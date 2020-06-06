var mongoose = require("mongoose");
// create schema
var Schema = mongoose.Schema;

// create noteSchema with schema object
var noteSchema = new Schema({
  _headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
  },
  date: String,
  noteText: String
});

// create Note model using noteSchema
var Note = mongoose.model("Note", noteSchema);

module.exports = Note;
