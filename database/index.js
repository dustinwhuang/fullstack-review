const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let repoSchema = mongoose.Schema({
  _id: Number,
  owner_login: String,
  name: String,
  url: String,
  description: String,
  forks: Number
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (repos) => {
  return new Promise((resolve, reject) => {
    if (repos.constructor !== Array) {
      reject('Not valid repos');
    }
      
    repos && repos.forEach(({id, name, owner, description, html_url, forks}) => {
      Repo.create({_id: id, owner_login: owner.login, name: name, url: html_url, description: description, forks: forks});
    });
    resolve();
  });
};

const getRepos = (callback) => {
  Repo.find().sort({forks: -1}).limit(25).exec((err, repos) => callback(err, repos));
};

module.exports = {
  save: save,
  getRepos: getRepos
};