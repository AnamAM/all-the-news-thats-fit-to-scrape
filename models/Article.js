const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ArticleSchema = new Schema({

    title: {
        type: String
    },
    link: {
        type: String
    },
    saved: {
        type: Boolean,
        default: false
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Article = mongoose.model("Article", ArticleSchema)

module.exports = Article;