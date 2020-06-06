//when the html is loaded, run the js
$(document).ready(function() {
  //article container div from the homepage
  var articleContainer = $(".article-container");
  //listen to run the functions
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

//run the app on page load
runApp();

  function runApp() {
    //empty the article container div
    articleContainer.empty();
    //get the unsaved articles
    $.get("/api/headlines?saved=false")
      .then(function(data) {
        // if there are headlines, load to page
        if (data && data.length) {
          loadArticles(data);
        }
        else {
          // or run the renderEmpty function
          renderEmpty();
        }
      });
  }

  function loadArticles(articles) {
    //empty article cards array
    var articlecards = [];
    //for each article that was populated in populateBSCard, push into article cards
    for (var i = 0; i < articles.length; i++) {
      articlecards.push(populateBSCard(articles[i]));
    }
    //push the article cards into the article container div on the page
    articleContainer.append(articlecards);
  }

  function populateBSCard(article) {
    //card html
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
    //attach the article id to the card
    card.data("_id", article._id);
    //return the card as jquery element
    return card;
  }

  function renderEmpty() {
    //alert when there are no articles
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
    //append emptyAlert article container onto page
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    //the article to save is the card with the data (id)
    var articleToSave = $(this).parents(".card").data();
    // set articleToSave to true
    articleToSave.saved = true;
    //ajax method patch to update the loaded
    $.ajax({
      method: "PATCH",
      url: "/api/headlines",
      data: articleToSave
    })
    .then(function(data) {
      // if data is true, run the app again
      if (data.ok) {
        //run the app without the saved:true
        runApp();
      }
    });
  }

  function handleArticleScrape() {
    //get the articles
    $.get("/api/fetch")
      // then run the app
      .then(function(data) {
        //run app
        runApp();
        //run the bootbox with the message of scrape results
        bootbox.alert ( {
          message: "<h3 class='text-center m-top-80'>" + data.message + "<h3>",
          // don't want a close button if there's an OK button already
          closeButton: false
        }
          );
      });
  }
});
