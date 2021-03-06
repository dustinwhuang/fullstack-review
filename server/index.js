const express = require('express');
const parser = require('body-parser');
const request = require('request');
const db = require('../database');
const gh = require('../helpers/github');

let app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(parser.urlencoded({extended: true}))

app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
  gh.getReposByUsername(req.body.username)
    .then(repos => db.save(repos))
    .then(response => res.send(response));
});

app.get('/repos', function (req, res) {
  db.getRepos()
    .then(repos => res.send(repos));
});

app.get('/users', function (req, res) {
  db.getUsers()
    .then(users => res.send(users));
});

app.get('/user', function (req, res) {
  if (req.query.user._id) {
    db.getUserRepos(req.query.user._id)
      .then(repos => res.send(repos));
  }
});

app.get('/user/friends', function (req, res) {
  db.getUserFriends(req.query.user)
    .then(friends => res.send(friends));
});

let port = process.env.PORT || 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

