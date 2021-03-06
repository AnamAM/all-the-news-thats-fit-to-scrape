var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, we can create a new UserSchema object which is similiar to a Sequelize model
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    favorited: {
        type: String,
        default: false
    },

    // 'comment' is an object that stores a Comment id
    // The ref property links the ObjectId to the Comment model, which allows us to populate the Article with an associated Comment
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

// This creates our model from the above schema using mongoose's model method 
var Article = mongoose.model("Article", ArticleSchema);

// Exporting the Article model
module.exports = Article;