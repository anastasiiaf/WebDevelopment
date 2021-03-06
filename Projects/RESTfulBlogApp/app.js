var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  expressSanitizer = require('express-sanitizer'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(
  'mongodb+srv://Anastasiia:250591Rada@cluster0-v3ypj.mongodb.net/blog?retryWrites=true&w=majority',
);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static('public'));
app.use(methodOverride('_method')); // overrides for POST request in edit.ejs to PUT

var blogSchema = new mongoose.Schema({
  title: String,
  image: { type: String, default: 'Put image here' },
  body: String,
  created: { type: Date, default: Date.now },
});

var Blog = mongoose.model('Blog', blogSchema);

/* Blog.create({
  title: 'Learning routes',
  image: 'https://unsplash.com/photos/BQ6oryriY9c',
  body: 'Learning routes',
}); */
app.get('/', function (req, res) {
  res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log('ERROR');
    } else {
      res.render('index', { blogs: blogs });
    }
  });
});

// NEW ROUTE
app.get('/blogs/new', function (req, res) {
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function (req, res) {
  //req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      console.log(err);
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});

// SHOW ROUTE
app.get('/blogs/:id', function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show', { blog: foundBlog });
    }
  });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', { blog: foundBlog });
    }
  });
});

// UPDATE ROUTE
app.put('/blogs/:id', function (req, res) {
  //req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete('/blogs/:id', function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(3000, process.env.IP, function () {
  console.log('Blog server has started!');
});
