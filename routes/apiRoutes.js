var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var path = require("path");

module.exports = function (app) {

    // Routes

    // A GET route for scraping the reuters website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        var url = "https://www.reuters.com/"
        var data = []
        axios.get(url).then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            // console.log(response.data)


            // Now, we grab every story-title  and do the following:
            $("article .story-content").each(function (i, element) {
                // Save an empty result object

                var result = {};
                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("a")
                    .text().replace(/[\n\r\t]/g, '');
                result.link = $(this)
                    .children("a")
                    .attr("href");

                result.link = url + result.link

                data.push(result)

            });

            // Send a message to the client
            console.log(data)
            res.send(data);
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    ///get article by id and notes

    // Route for getting all Articles from the db
    app.get("/articles/:id", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.findOne({ _id: req.params.id })
            .populate('note')
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                console.log("note object "+dbArticle.note)
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });


    //route to post arctile to db
    app.post("/articles", function (req, res) {

        console.log("in db" + JSON.stringify(req.body))
        db.Article.create(req.body)
            .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                res.send("Article Saved")
            })
            .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
                res.end()
            });


    })
    //add notes
    app.post("/articles/:id", function (req, res) {

        console.log("in note db" + JSON.stringify(req.body))
        db.Note.create(req.body)
            .then(result => {
                console.log("note id "+result._id)
                db.Article
                    .findOneAndUpdate({ _id: req.params.id }, { $push: { note: result._id } }, { new: true })//saving reference to note in corresponding article
                    .then(data => res.json(result))
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));


    })
//remove saved articles
    app.delete("/articles", function (req, res) {

        db.Article.deleteOne(req.body)
            .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                res.send("Article Removed")
            })
            .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
                res.end()
            });
    })

//remove notes



app.delete("/notes", function (req, res) {

    db.Note.deleteOne(req.body)
        .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            res.send("Article Removed")
        })
        .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
            res.end()
        });
})

    // // Route for grabbing a specific Article by id, populate it with it's note
    // app.get("/articles/:id", function (req, res) {
    //     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...

    //     console.log("in add note button db side")
    //     db.Article.findOne({ _id: req.params.id })
    //         // ..and populate all of the notes associated with it
    //         .populate('note')
    //         .then(function (dbArticle) {
    //             // If we were able to successfully find an Article with the given id, send it back to the client
    //             res.json(dbArticle);
    //         })
    //         .catch(function (err) {
    //             // If an error occurred, send it to the client
    //             res.json(err);
    //         });
    // });

    // // Route for saving/updating an Article's associated Note
    // app.post("/articles/:id", function (req, res) {
    //     // Create a new note and pass the req.body to the entry
    //     db.Note.create(req.body)
    //         .then(function (dbNote) {
    //             // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    //             // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    //             // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    //             return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    //         })
    //         .then(function (dbArticle) {
    //             // If we were able to successfully update an Article, send it back to the client
    //             res.json(dbArticle);
    //         })
    //         .catch(function (err) {
    //             // If an error occurred, send it to the client
    //             res.json(err);
    //         });
    // });


}