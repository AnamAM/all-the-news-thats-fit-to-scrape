var mongoose = require("mongoose");

// Saving a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, we can create a new CommentSchema object
var CommentSchema = new Schema({
    title: String,
    body: String
});

// This creates our model from the above schema using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Exporting the Comment model
module.exports = Comment;
