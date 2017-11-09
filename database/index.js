const mongoose = require('mongoose');
const gh = require('../helpers/github');

mongoose.connect('mongodb://localhost/fetcher', {useMongoClient: true});

let repoSchema = mongoose.Schema({
  _id: Number,
  owner_login: String,
  name: String,
  url: String,
  description: String,
  forks: Number,
  updated_at: Date
});

let userSchema = mongoose.Schema({
  _id: Number,
  login: String
});

let contributorSchema = mongoose.Schema({
  repo_id: Number,
  user_id: Number
});

let Repo = mongoose.model('Repo', repoSchema);
let User = mongoose.model('User', userSchema);
let Contributor = mongoose.model('Contributor', contributorSchema);

let save = (repos) => {
  return new Promise((resolve, reject) => {
    if (repos.constructor !== Array) {
      reject('Not valid repos');
    }

    User.create({_id: repos[0].owner.id, login: repos[0].owner.login});

    let status = {added: 0, updated: 0, skipped: 0};
    repos && repos.forEach(({id, name, owner, description, html_url, forks, updated_at, contributors_url}) => {
      let docs = {_id: id, owner_login: owner.login, name: name, url: html_url, description: description, forks: forks, updated_at: updated_at};
      Repo.create(docs)
        .then(() => {
          status.added++;
          completed();
        })
        .catch(() => {
          Repo.findOne({_id: id})
            .exec((err, repo) => {
              if (updated_at > repo.updated_at) {
                Repo.findOneAndUpdate({_id: id}, docs, {upsert: true, new: true});
                status.updated++;
                completed();
              } else {
                status.skipped++;
                completed();
              }
            });
        });

      gh.getContributors(contributors_url)
        .then(contributors => contributors.forEach(contributor => {
          Contributor.create({repo_id: id, user_id: contributor.id});
          User.create({_id: id, login: contributor.login});
        }));
    });

    const completed = () => {
      if (status.added + status.updated + status.skipped === repos.length) {
        resolve(status);
      }
    }
  });
};

const getRepos = () => {
  return new Promise((resolve, reject) => {
    Repo.find().sort({forks: -1}).limit(25)
      .exec((err, repos) => resolve(repos));
  });
};

module.exports = {
  save: save,
  getRepos: getRepos
};