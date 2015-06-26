var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Entry = require('./entry.js');
var User = require('./user.js');

// There is no API for users independent of entries.

router.get('/entries', function(req, res, done) {
  Entry.find({}, function(error, entryList) {
    res.json(entryList);
  });
});

router.get('/entries/:id', function(req, res, done) {
  Entry.find({
    _id: req.params.id
  }, function(error, entry) {
    res.json(entry);
  });
});

router.post('/entries', jsonParser);
router.post('/entries', function(req, res) {
  Entry.create(req.body, function(error, Entry) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(201);
    }
  });
});

router.put('/entries/:id', jsonParser);
router.put('/entries/:id', function(req, res) {
  Entry.update({
    _id: req.params.id
  }, req.body, function(error) {
    if (error) {
      console.error(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

router.patch('/entries/:id', jsonParser);
router.patch('/entries/:id', function(req, res) {
  Entry.update({
    _id: req.params.id
  }, {
    $set: req.body
  }, function(error) {
    if (error) {
      console.error(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/entries/:id', function(req, res) {
  Entry.remove({
    _id: req.params.id
  }, function(error) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
