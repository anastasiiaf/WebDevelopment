var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
var Market = require('./models/market');
var Comment = require('./models/comment');

var data = [
  {
    name: 'Grønland Torg',
    image: 'https://pbs.twimg.com/media/A8YxpuiCAAACxgY.jpg',
    description: 'busy place',
  },
  {
    name: 'Brugata Torg',
    image: 'https://mappno.com/yer/gr-nlandtorg-frukt-gr-nt-3225.jpg',
    description: '3 mins from center',
  },
  {
    name: 'Lambertseter Torg',
    image: 'https://s3-media0.fl.yelpcdn.com/bphoto/LpU0vCDv6fqLSNRF45d64Q/300s.jpg',
    description: 'mall shop',
  },
];
function seedDB() {
  // removing shops
  Market.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log('removed market');
    // .. and then seeding shops from data
    data.forEach(function (seed) {
      Market.create(seed, function (err, shop) {
        if (err) {
          console.log(err);
        } else {
          console.log('added market');

          // adding comment
          Comment.create(
            {
              text: 'nice shop!',
              author: 'Anonym',
            },
            function (err, comment) {
              if (err) {
                console.log(err);
              } else {
                shop.comments.push(comment);
                shop.save();
                console.log('created comment');
              }
            },
          );
        }
      });
    });
  });
}

module.exports = seedDB;
