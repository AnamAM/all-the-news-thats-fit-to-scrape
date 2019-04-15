const express = require("express");
const hb = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const logger = require("morgan");
const db = require("./models");

const PORT = 3000;

var app = express();
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoScraper", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
    axios.get("https://www.vogue.com/fashion").then(function (response) {
        var $ = cheerio.load(response.data);

        var results = {};

        $("div.feed-card--container").each(function (i, element) {

            results.title = $(element).children().find("h2.feed-card--title").text();
            results.link = $(element).children().find("h2.feed-card--title").find("a").attr("href");
            results.saved = false;

            db.Article.create(results)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                }).catch(function (error) {
                    console.log(error);
                })
        })
        res.send("Scrape is complete.");
        console.log(results);
    })
})

app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (error) {
        res.json(error);
    });
});

app.post("/articles/:id", function (req, res) {
    var id = req.params.id
    db.Article.updateOne({ _id: id }, { $set: { saved: true } }, function (error, edited) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            console.log(edited);
            res.send(edited);
        }
    })
})

app.get("/savedArticles", function (req, res) {
    db.Article.find({ saved: true }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (error) {
        res.json(error);
    });
})

app.post("/remove/:id", function (req, res) {
    var id = req.params.id
    db.Article.updateOne({ _id: id }, { $set: { saved: false } }, function (error, edited) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            console.log(edited);
            res.send(edited);
        }
    })
})

app.get("/article/:id", function (req, res) {
    var id = req.params.id
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            console.log(dbArticle);
            res.json(dbArticle);
        })
        .catch(function (error) {
            res.json(error);
        });
})

app.post("/comments/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true })
                .then(function (dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function (error) {
                    res.json(error);
                });
        })
        .catch(function (error) {
            res.json(error);
        })
})

app.delete("/cleanDB", function (req, res) {
    db.Article.deleteMany({ saved: false }, function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(null, data);
        }
    });
})


app.listen(PORT, function () {
    console.log("App is listening on " + PORT + ".");
})
