$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href="+ data[i].link+">"+data[i].link +"</a></p>");
      var newArticle = `<div data-id=${data[i]._id} class="shadow"> <h3>${data[i].title} </h3><button type="button" class="btn btn-danger float-right delete-article">Delete Article</button><a href= ${data[i].link}>${data[i].link}</a></div><br />
          `
            $("#articles").append(newArticle)
    }
  });