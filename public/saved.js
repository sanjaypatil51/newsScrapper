var thisId

$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href="+ data[i].link+">"+data[i].link +"</a></p>");
        var newArticle = `<div data-id=${data[i]._id} class="shadow"> <h3>${data[i].title} </h3><button type="button" class="btn btn-danger float-right delete-article">Delete Article</button>
        <button type="button" class="btn btn-warning float-right add-notes">Notes</button>
        <a href= ${data[i].link}>${data[i].link}</a></div><br />
          `
        $("#articles").append(newArticle)
    }
});
//delete articles
$("#articles").on("click", ".delete-article", function (event) {
    event.preventDefault()
    var bparentNode = $(this).parent()

    $.ajax({
        method: "DELETE",
        url: "/articles",
        data: {
            _id: $(this).parent().attr("data-id")

        }
    }).then(function (response) {
        console.log(response)
        bparentNode.remove()

    })

})

//get notes for each article on button press

$("#articles").on("click", ".add-notes", function (event) {

    thisId = $(this).parent().attr("data-id");

    $.ajax({
        url: "/articles/" + thisId,
        method: "GET"
    })
        .then(function (data) {

            console.log("in get note NCB")
            console.log(JSON.stringify(data))
            var newDiv=$("<div>")

            $.each(data.note, function (i, item) {
                console.log("in get note CB")
                console.log(item.body)

                var noteBody=`<div data-id=${item._id}> ${item.body}<button class="btn delete-note">X</button></div>`
                $(newDiv).append(noteBody)                

            })

            $(".allNotes").append(newDiv)
            //   for (var i = 0; i < data.length; i++) {
            //     // Display the apropos information on the page
            //     // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href="+ data[i].link+">"+data[i].link +"</a></p>");
            //     if (data[i].title && data[i].link) {
            //       var newArticle = `<div data-id=${i} class="shadow"> <h3>${data[i].title} </h3><button type="button" class="btn btn-success float-right save-article">Save Article</button><a href= ${data[i].link}>${data[i].link}</a></div><br />
            //     `
            //       $(".allNotes").append(newArticle)
            //     }
            //   }

            $("#note-modal").modal("toggle");

        })




})

$("#note-modal").on("click", ".noteSubmit", function () {

    var nBody = $("#notes").val().trim()

    if (nBody) {

        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: "",
                body: nBody

            }
        }).then(function (response) {
            console.log(response)
            bparentNode.remove()

        })
        $("#note-modal .allNotes").remove()
    }
    else{
        $("#note-modal .allNotes").remove()
    }


})
//delete notes
$("#note-modal").on("click", ".delete-note", function () {
    var noteId = $(this).parent().attr("data-id");

    var bparentNode = $(this).parent()

    $.ajax({
      method: "DELETE",
      url: "/notes",
      data: {
        _id: $(this).parent().attr("data-id"),
        

    }
    }).then(function (response) {
      console.log(response)
      bparentNode.remove()
  
    })



})