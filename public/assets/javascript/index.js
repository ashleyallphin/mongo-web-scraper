/* gloabl bootbox */
$(document).ready(function() {
  // Setting a reference to the article-container div where all the dynamic content will go
  // Adding event listeners to any dynamically generated "save article"
  // and "scrape new article" buttons
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  // Once the page is ready, run the runApp function to kick things off
  runApp();

  function runApp() {
    // Empty the article container, run an AJAX request for any unsaved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=false")
      .then(function(data) {
        // If we have headlines, render them to the page
        if (data && data.length) {
          loadArticles(data);
        }
        else {
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
      $([ //whole card
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
                    "<div class='card-body'>",
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
                        //article headline
                        "<div class='article-title'>",
                            "<h5 class='card-title'>",
                                //link to article
                                "<a target='_blank' href = ' ",
                                    article.source,
                                    " '> ",
                                    article.headline,
                                "</a>",
                            "</h5>",
                        "</div>",
                        //save article button
                        "<a class='btn btn-primary btn-md save-article-button save' role='button' style='color: #fff'>",
                            "Save Article",
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
      // We will use this when trying to figure out which article the user wants to save
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
  
      
  }

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert =
      $([
      '<div class="alert alert-primary container text-center articles col-10 offset-1" id="no-articles" role="alert">',
        '<h2>',
          "You have not loaded any articles yet.",
        '</h2>',
        "<div class='scrape-instructions'>",
          "Click the Scrape Articles button to add articles from",
          "<i>",
          "The Ringer.",
          "</i>",
        "</div>",
      "</div>"
      ].join(""));
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attatched a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    var articleToSave = $(this).parents(".card").data();
    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PATCH",
      url: "/api/headlines",
      data: articleToSave
    })
    .then(function(data) {
      // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
      // (which casts to 'true')
      if (data.ok) {
        // Run the runApp function again. This will reload the entire list of articles
        runApp();
      }
    });
  }

  function handleArticleScrape() {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/api/fetch")
      .then(function(data) {
        // If we are able to succesfully scrape the NYTIMES and compare the articles to those
        // already in our collection, re render the articles on the page
        // and let the user know how many unique articles we were able to save
        runApp();
        bootbox.alert ( {
          message: "<h3 class='text-center m-top-80'>" + data.message + "<h3>",
          closeButton: false
        }
          );
      });
  }
});
