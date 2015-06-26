var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');

var entrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    autopopulate: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  comment: {
    type: String,
    required: true
  }
});

entrySchema.plugin(autopopulate);

var Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
