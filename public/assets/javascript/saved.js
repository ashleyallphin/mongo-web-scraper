// when the html is loaded, run the js
$(document).ready(function() {
  // use $ as the article container div
  var articleContainer = $(".article-container");
  // listening to run the functions
  $(document).on("click", ".delete-article-button", deleteArticle);
  $(document).on("click", ".article-notes-button", openNotesModal);
  $(document).on("click", ".btn.save", addNote);
  $(document).on("click", ".btn.note-delete", deleteNote);

  //run the app on page load
  runApp();

  function runApp() {
    // empty the article container
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      //if there is data, load the articles
      if (data && data.length) {
        loadArticles(data);
      } else {
        //or tell the user there are not articles loaded yet
        renderEmpty();
      }
    });
  }

  function loadArticles(articles) {
    //empty cards array
    var articlecards = [];
    //for each card, push them into the article cards array
    for (var i = 0; i < articles.length; i++) {
      articlecards.push(populateBSCard(articles[i]));
    }
    //push the article cards into the article container to render on the page
    articleContainer.append(articlecards);
  }

  function populateBSCard(article) {
    //card html that populates the bootstrap card
    var card =
      $([
      //whole card
      "<div class='card col-10 offset-1 article-card'>",
          //row inside the card
          "<div class='row no-gutters'>",
              //article image -- left 4 columns
              "<div class='col-md-3'>",
                  "<img class='card-img article-img' alt='article-image' src='",
                      article.image,
                  "' </img>",
              "</div>",
              //card body -- right 8 columns
              "<div class='col-md-9'>",
                  //article info
                  "<div class='card-body'>",                            //article date and category div
                      //date, category, and close button div
                      "<div class='date-category-close flex'>",
                              //article date and category div
                              "<div class='date-and-category'>",
                                  //article date
                                  "<div class='article-date'>", 
                                      "<small class='text-muted'>",
                                      article.date,
                                      "</small>",
                                  "</div>",
                                  //article category
                                  "<div class='category'>",
                                      "<h6>",
                                      article.category, 
                                      "</h6>",
                                  "</div>",
                              "</div>",
                              //remove article button
                              "<div class='delete-article-button' cursor:pointer title='Remove article'>",
                                  "&times;",
                              "</div>",
                      "</div>",      
                      //article headline
                      "<div class='article-title'>",
                          "<h5 class='card-title'>",
                              //link to article
                              "<a target='_blank' href = ' ",
                                  article.source,
                                  " '> ",
                                  "<div class='balance-text'>",
                                  article.headline,
                                  "<div>",
                              "</a>",
                          "</h5>",
                      "</div>",
                      //save article button
                      "<a class='btn btn-primary btn-md article-notes-button' role='button' style='color: #fff' data-toggle='modal' data-target='#articleNotesModal' title='Open article notes modal'>",
                          "Article Notes",
                      "</a>",
                  //end article info
                  "</div>",
              //end card body
              "</div>",
          //end row
          "</div>",
      //end card
      "</div>"
      ].join(""));
    //attach the artcle's id
    card.data("_id", article._id);
    //attach the article's headline to show in modal
    card.data("_headline", article.headline);
    // return the card
    return card;
  }

  function renderEmpty() {
    //html for when the article-container is empty
    var emptyAlert =
      $([
      "<div class='alert alert-primary container text-center articles col-10 offset-1' role='alert' id='no-saved-articles-alert'>",
        "<h2>",
          "You do not have any saved articles.",
        "</h2>",
      "</div>"
      ].join(""));
    // show the emptyAlert on the page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    // empty array
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      //if there are no notes, tell the user there are no notes
      currentNote = [
        "<li class='list-group-item no-notes-yet'>",
          "You have not added any notes for this article.",
        "</li>"
      ].join("");
        // push the currentNote <li> into notesToRender
        notesToRender.push(currentNote);
    }
    else {
      //if we do have notes, go through a loop to render the notesToRender into note-container
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $([
          "<li class='list-group-item note'>",
          data.notes[i].noteText,
          "<button class='btn note-delete'>",
            '<div class="display-icon">',
              '<i class="fa-spinnerZoom fa far fa-trash-alt fa-1x fa-fw "></i>',
            "</div>",
          "</button>",
          "</li>"
        ].join(""));
        // trash can button deletes the note with the associated article id
        currentNote.children("button").data("_id", data.notes[i]._id);
        // push the currentNote <li> into notesToRender
        notesToRender.push(currentNote);
      }
    }
    //append the notesToRender to the note container
    $(".note-container").append(notesToRender);
  }

  function deleteArticle() {
    // deletes the article
    var articleToDelete = $(this).parents(".card").data();
    // ajax method to delete the article with the associated ID (data)
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      // If this works out, run runApp again which will rerender our list of saved articles
      if (data.ok) {
        runApp();
      }
    });
  }

  function openNotesModal() {
    var currentArticle = $(this).parents(".card").data();
    
    //get the note with the associated article ID
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      //populates the bs modal
      var modalText = [
        "<div class='container-fluid text-center'>",
          "<h5>",
          currentArticle._headline,
          "</h5>",
          "<hr />",
          "<ul class='list-group note-container'>",
          "</ul>",
          "<textarea class='add-note-textarea' placeholder='Add New Note' rows='4' cols='50'></textarea>",
          "<button class='btn save save-note-button' style='margin-top: 10px' >Add Note</button>",
        "</div>"
      ].join("");
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      $(".btn.save").data("article", noteData);
      renderNotesList(noteData);
    });
  }

  function addNote() {
    //add the text the user entered into the note
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    // 
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        //close the modal
        // bootbox.hideAll();
      });
    }
  }

  function deleteNote() {
    //delete the note with the associated id
    var noteToDelete = $(this).data("_id");
    //DELETE ajax method
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      //close the modal
    });
    //remove the note in the DOM
    $(this).closest('.list-group-item').remove();
  }
});
