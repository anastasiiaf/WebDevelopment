var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
// Schema setup
var commentSchema = new mongoose.Schema({
  text: String,
  author: String,
});

module.exports = mongoose.model('comment', commentSchema);
