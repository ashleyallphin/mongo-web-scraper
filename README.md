Mongo Web Scraper
======


_Ashley Allphin_

UTA-VIRT-FSF-PT-01-2020-U-LOL Homework #18

> ### Deployed to Heroku [here](https://web-scraper-codingbootcamp-18.herokuapp.com/).


![home-page](public/assets/images/home-page.png)

## Overview

This `Node.js` & `MongoDB` app utilizes `cheerio` to scrape headlines from [The Ringer](www.theringer.com/features).  Articles are returned to the page with options to save and post notes.

### Functionality

On the backend, the app uses `express` to serve routes and `mongoose` to interact with a Mongo database.

On the frontend, the app uses `handlebars` for templating and Bootstrap as a styling framework. `jQuery` and `AJAX` are used to post articles and notes to the pages.

### Dependencies

   1. `express`

   2. `express-handlebars`

   3. `mongoose`

   4. `cheerio`

   5. `axios`


### Database
```js
// If deployed, use the deployed database. Otherwise, use the local ringerHeadlines database.

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ringerHeadlines";

mongoose.connect(MONGODB_URI);
```

This code creates a `mongoose` connection via mLab MongoDB Heroku add-on if deployed, but otherwise will connect to the local database mongoHeadlines collection.

## Functionality

### Scraping Articles

### Saving Articles

### Posting Notes to Articles