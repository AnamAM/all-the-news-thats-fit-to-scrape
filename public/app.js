$(document).ready(function () {
    $(".articles").on("click", function (event) {
        event.preventDefault();
        $(".allArticles").empty();

        $.getJSON("/scrape", function (data) {
            console.log(data);
        });
        $.getJSON("/articles", function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].favorited) {
                    var displayDiv = $("<div>").append(
                        $("<h3>").text(data[i].title),
                        $("<a>").text("Check out the article!").attr("href", "https://www.vogue.com/" + data[i].link)
                    ).addClass("articleDiv").attr("data-id", "data[i]._id")
                    $(".allArticles").append(displayDiv);
                }
                else {
                    var displayDiv = $("<div>").append(
                        $("<h3>").text(data[i].title),
                        $("<a>").text("Check out the article!").attr("href", "https://www.vogue.com/" + data[i].link)
                    ).addClass("articleDiv").attr("data-id", "data[i]._id")
                    $(".allArticles").append(displayDiv);
                }
            }
        })
    })
})