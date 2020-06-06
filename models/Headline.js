//MONGOOSE SCHEMAS: Headlines
//===================================================

//require mongoose npm
const mongoose = require('mongoose');

//Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

//mongoose method to create Schema
const Schema = mongoose.Schema;

//create new schema stored in variable 'headlineSchema'
// By default, Mongoose adds an _id property to your schemas.
const headlineSchema = new Schema({
    //data to add into the collection
    headline: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
        //this will change to true when the user saves the article
    }
});

//convert headlineSchema into model, store in variable called 'Headline'
const Headline = mongoose.model("Headline", headlineSchema);

//export Headline for use in app
module.exports = Headline;