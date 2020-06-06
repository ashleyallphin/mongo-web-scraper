/* global bootbox */
$(document).ready(function() {
  // Getting a reference to the article container div we will be rendering all articles inside of
  var articleContainer = $(".article-container");
  // Adding event listeners for dynamically generated buttons for deleting articles,
  // pulling up article notes, saving article notes, and deleting article notes
  $(document).on("click", ".delete-article-button", deleteArticle);
  $(document).on("click", ".article-notes-button", articleNotesFunction);
  $(document).on("click", ".btn.save", addNote);
  $(document).on("click", ".btn.note-delete", deleteNote);

  // runApp kicks everything off when the page is loaded
  runApp();

  function runApp() {
    // Empty the article container, run an AJAX request for any saved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      // If we have headlines, render them to the page
      if (data && data.length) {
        loadArticles(data);
      } else {
        // Otherwise render a message explaing we have no articles
        renderEmpty();
      }
    });
  }

  function loadArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articlecards = [];
    // We pass each article JSON object to the populateBSCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articlecards.push(populateBSCard(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articlecards array,
    // append them to the articlecards container
    articleContainer.append(articlecards);
  }

  function populateBSCard(article) {
    // This functiont takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
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
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to remove or open notes for
    card.data("_id", article._id);
    card.data("_headline", article.headline);
    // We return the constructed card jQuery element
    return card;
  }

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert =
      $([
      "<div class='alert alert-primary container text-center articles col-10 offset-1' role='alert' id='no-saved-articles-alert'>",
        "<h2>",
          "You do not have any saved articles.",
        "</h2>",
      "</div>"
      ].join(""));
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    // This function handles rendering note list items to our notes modal
    // Setting up an array of notes to render after finished
    // Also setting up a currentNote variable to temporarily store each note
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      // If we have no notes, just display a message explaing this
      currentNote = [
        "<li class='list-group-item no-notes-yet'>",
        "You have not added any notes for this article.",
        "</li>"
      ].join("");
      notesToRender.push(currentNote);
    }
    else {
      // If we do have notes, go through each one
      for (var i = 0; i < data.notes.length; i++) {
        // Constructs an li element to contain our noteText and a delete button
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
        // Store the note id on the delete button for easy access when trying to delete
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Adding our currentNote to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // Now append the notesToRender to the note-container inside the note modal
    $(".note-container").append(notesToRender);
  }

  function deleteArticle() {
    // This function handles deleting articles/headlines
    // We grab the id of the article to delete from the card element the delete button sits inside
    var articleToDelete = $(this).parents(".card").data();
    // Using a delete method here just to be semantic since we are deleting an article/headline
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

  function articleNotesFunction() {
    // This function handles opending the notes modal and displaying our notes
    // We grab the id of the article to get notes for from the card element the delete button sits inside
    var currentArticle = $(this).parents(".card").data();
    
    // Grab any notes with this headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      // Constructing our initial HTML to add to the notes modal
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
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      // Adding some information about the article and article notes to the save button for easy access
      // When trying to add a new note
      $(".btn.save").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderNotesList(noteData);
    });
  }

  function addNote() {
    // This function handles what happens when a user tries to save a new note for an article
    // Setting a variable to hold some formatted data about our note,
    // grabbing the note typed into the input box
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    // If we actually have data typed into the note input field, format it
    // and post it to the "/api/notes" route and send the formatted noteData as well
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        // When complete, close the modal
        // bootbox.hideAll();
      });
    }
  }

  function deleteNote() {
    // This function handles the deletion of notes
    // First we grab the id of the note we want to delete
    // We stored this data on the delete button when we created it
    var noteToDelete = $(this).data("_id");
    // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      // bootbox.hideAll();
    });
    // remove the note in the DOM
    $(this).closest('.list-group-item').remove();
  }
});
