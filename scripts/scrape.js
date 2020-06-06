var request = require("request");
var cheerio = require("cheerio");

// scrape NYT
var scrape = function(cb) {
  request("https://www.theringer.com/features", function (err, res, body){
    var $ = cheerio.load(body);
    var articles = [];

    $(".c-compact-river__entry--featured").each(function(i, element) {

      var head = $(element).find(".c-entry-box--compact__title").text().trim();
      var cat = $(element).find(".c-entry-box--compact__label").text().trim();
      var imgSrc = $(element).find(".c-entry-box--compact__image").find("noscript").find("img").attr("src");
      
      
      //grab the image URL & set to the variable "img"
      // var img = $(element).find(".c-entry-box--compact__image").find("noscript").text().split('<img alt="" src="').join("");
      //remove "> from end of img return
      // str = img;
      // imgSrc = img.toString().substr(0, str.length -2);

      //grab the link & set to the variable "link"
      var link = $(element).find("a").attr("href");

      //grab the date of the article
      var date = $(element).find(".c-byline").find("time").text().trim().replace("  ", " 0");

      if (head && cat) {

        var dataToAdd = {
          headline: head,
          category: cat,
          date: date,
          source: link,
          image: imgSrc

        };
        // console.log("====================");
        // console.log("headline " + head);
        // console.log("category " + cat);
        // console.log("category: " + cat);
        // console.log("image: " + imgSrc);
        // console.log("link: " + link);
        // console.log("date: " + date);
        // console.log("==================== \n");

        articles.push(dataToAdd);
      }
    });
    cb(articles);
  });
};

module.exports = scrape;
