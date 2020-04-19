// Scrape articles on page load
$.ajax({
  url: "/scrape",
  method: "GET"
})
  .then(function (data) {

    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href="+ data[i].link+">"+data[i].link +"</a></p>");
      if (data[i].title && data[i].link) {
        var newArticle = `<div data-id=${i} class="shadow"> <h3>${data[i].title} </h3><button type="button" class="btn btn-info float-right save-article">Save Article</button><a href= ${data[i].link}>${data[i].link}</a></div><br />
      `
        $("#articles").append(newArticle)
      }
    }

  })



//scrape articles

$("#scrape-article").on("click", function () {
  console.log("in scrape button")

  $.ajax({
    url: "/scrape",
    method: "GET"
  })
    .then(function (data) {

      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href="+ data[i].link+">"+data[i].link +"</a></p>");
        if (data[i].title && data[i].link) {
          var newArticle = `<div data-id=${i} class="shadow"> <h3>${data[i].title} </h3><button type="button" class="btn btn-info float-right save-article">Save Article</button><a href= ${data[i].link}>${data[i].link}</a></div><br />
        `
          $("#articles").append(newArticle)
        }
      }

    })
})

//post articles
$("#articles").on("click", ".save-article", function () {
  console.log("in post")

  console.log($(this))
  console.log($(this).parent())

  console.log($(this).parent()[0].childNodes[1].innerText)

  console.log($(this).parent()[0].childNodes[3].href)
  var thisId = $(this).parent().attr("data-id");

  console.log(thisId)
  // console.log($(this).parent().text())
  // console.log($(this)[0].parent().childNodes[1].nodeValue)
  // console.log($(this).parent().attr("href"))
 var bparentNode=$(this).parent()

  $.ajax({
    method: "POST",
    url: "/articles",
    data: {
      title: $(this).parent()[0].childNodes[1].innerText,
      link: $(this).parent()[0].childNodes[3].href
    }
  }).then(function (response) {
    console.log(response)
    bparentNode.remove()

  })

})
