Mongo Web Scraper
======


_Ashley Allphin_

UTA-VIRT-FSF-PT-01-2020-U-LOL Homework #18

> ### Deployed to Heroku [here](https://web-scraper-codingbootcamp-18.herokuapp.com/).


![home-page](public/assets/images/home-page.png)

## Overview

This app utilizes `cheerio` to scrape articles from [The Ringer](www.theringer.com/features).  Articles are returned to the page with options to save and post notes.

### Dependencies

   1. `express`

   2. `express-handlebars`

   3. `mongoose`

   4. `cheerio`

   5. `axios`

<br>

```js
// If deployed, use the deployed database. Otherwise, use the local ringerHeadlines database.

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ringerHeadlines";

mongoose.connect(MONGODB_URI);
```

This code creates a `mongoose` connection via mLab MongoDB Heroku add-on if deployed, but otherwise will connect to the local database mongoHeadlines collection.

