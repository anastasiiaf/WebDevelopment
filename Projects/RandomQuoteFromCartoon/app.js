// wiki api
const stripHtml = require('string-strip-html');
const fetch = require('node-fetch');
var url = 'https://en.wikiquote.org/w/api.php';

const cb = ({ tag, deleteFrom, deleteTo, insert, rangesArr, proposedReturn }) => {
  rangesArr.push(deleteFrom, deleteTo, insert);
};

var params = {
  action: 'query',
  titles: 'Family Guy/Season 1', // 'Family Guy/Season 2', 'The Simpsons/Season 1', 'South Park/Season 1', 'Futurama/Season 1', 'American_Dad!_(season_1)'
  prop: 'extracts',
  //explaintext: true,
  format: 'json',
};

url = url + '?origin=*';
Object.keys(params).forEach(function (key) {
  url += '&' + key + '=' + params[key];
});

fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    // get pages from response
    var pages = response.query.pages;

    Object.keys(pages).forEach(function (page) {
      // strip HTML page from tags except for h3 (name of episodes) and dl (quotes in one episode)
      var content = stripHtml(pages[page].extract, { ignoreTags: ['dl', 'h3'] });
      //console.log(content);
      // get episode ranges based on h3 location
      var episodesRanges = stripHtml(content, { ignoreTags: ['dl'], returnRangesOnly: true });
      //console.log(JSON.stringify(ranges, null, 4));
      //console.log(episodesRanges);
      var quotes = [];
      var episode = {
        title: String,
        episodeQuotes: [],
        episodeRange: [],
      };

      for (var i = 0; i < episodesRanges.length; i += 2) {
        //console.log(ranges[0][0]);
        // get title of episode
        var q = content.slice(episodesRanges[i][0], episodesRanges[i + 1][1]);
        episode.title = stripHtml(q);
        var qr = [];
        // get episode ranges
        if (i + 2 < episodesRanges.length) {
          qr = [episodesRanges[i + 1][1], episodesRanges[i + 2][0]];
        } else {
          qr = [episodesRanges[i + 1][1], content.length];
        }
        //console.log('Episode range');
        //console.log(qr);
        episode.episodeRange.push(qr);
        quotes.push(episode);
        episode = {
          title: String,
          episodeQuotes: [],
          episodeRange: [],
        };
      }
      //console.log(quotes);

      // for each episode based on dl tag extract quotes
      quotes.forEach(function (item) {
        var quotesInEpisode = [];
        var episode = content.slice(item.episodeRange[0][0], item.episodeRange[0][1]);

        /*   console.log('=======================================');
        console.log(episode);
        console.log(item.episodeRange); */
        // get ranges of quotes in episode
        var quoteRange = stripHtml(episode, { returnRangesOnly: true });
        //console.log(quoteRange, quoteRange.length);

        for (var i = 0; i < quoteRange.length - 1; i++) {
          //console.log(quoteRange[i][0], quoteRange[i + 1][1]);
          // extract quote
          var quote = episode.slice(quoteRange[i][0], quoteRange[i + 1][1]);
          quotesInEpisode.push(stripHtml(quote));
        }

        item.episodeQuotes.push(quotesInEpisode);

        //console.log(quotesInEpisode);
      });

      //console.log(quotes[0].episodeQuotes[0]);

      var randomSeed = Math.random();
      var x = Math.floor(randomSeed * quotes.length);
      var randomEpisode = quotes[x];
      var y = Math.floor(randomSeed * randomEpisode.episodeQuotes[0].length);
      var randomQuote = randomEpisode.episodeQuotes;
      //console.log(x, randomEpisode);
      console.log(randomEpisode.title);
      console.log(y, randomQuote[0][y]);
    });

    /*   if (response.query.search[0].title === 'Family Guy/Season 1') {
      console.log("Your search page 'Family Guy/Season 1' exists on English Wikipedia");
    } */
  })
  .catch(function (error) {
    console.log(error);
  });
