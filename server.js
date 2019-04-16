const express = require("express");
const hb = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const logger = require("morgan");
const db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
    axios.get("https://www.vogue.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        var results = {};

        $("div.feed-card--container").each(function (i, element) {

            results.title = $(element).children().find("h2.feed-card--title").text();
            results.link = $(element).children().find("h2.feed-card--title").find("a").attr("href");
            results.favorited = false;

            db.Article.create(results)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                }).catch(function (error) {
                    console.log(error);
                })
        })
        res.send("Scrape is complete.");
        console.log(results);
    });
});

// This route is to get all the Articles from the database
app.get("/articles", function(req, res) {
    // Grabbing every document in the Articles collection
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// This route is for grabbing a specific Article by id and populating it with it's comment



app.listen(PORT, function () {
    console.log("App is listening on " + PORT + ".");
});
