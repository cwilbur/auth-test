var mongoose = require('mongoose');
var credential = require('credential');
var languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  yearInvented: {
    type: Number,
    min: 1950,
    max: 2015,
    required: true
  },
  fans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  }]
});


var ProgrammingLanguage = mongoose.model('ProgrammingLanguge', languageSchema);

module.exports = ProgrammingLanguage;
