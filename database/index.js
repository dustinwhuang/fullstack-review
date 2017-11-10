const mongoose = require('mongoose');
const gh = require('../helpers/github');
mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost/fetcher', {useMongoClient: true});
mongoose.connect(`mongodb://hackreactor:${process.env.DBPASSWORD}@ds044689.mlab.com:44689/github-fetcher`, {useMongoClient: true});

let repoSchema = mongoose.Schema({
  _id: Number,
  owner: {type: Number, ref: 'User'},
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
  repo_id: {type: Number, ref: 'Repo'},
  login: String
});

let Repo = mongoose.model('Repo', repoSchema);
let User = mongoose.model('User', userSchema);
let Contributor = mongoose.model('Contributor', contributorSchema);

let save = (repos) => {
  return new Promise((resolve, reject) => {
    if (repos.constructor !== Array) {
      reject('Not valid repos');
    }

    let user = {_id: repos[0].owner.id, login: repos[0].owner.login};
    User.create(user)
      .catch(() => {/* ignore duplicate error */});

    let status = {added: 0, updated: 0, skipped: 0};
    repos && repos.forEach(({id, name, owner, description, html_url, forks, updated_at, contributors_url}) => {
      let docs = {_id: id, owner: owner.id, name: name, url: html_url, description: description, forks: forks, updated_at: updated_at};
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
          Contributor.create({repo_id: id, login: contributor.login});
          // Don't add contributors to users, or else massive tree start building
          // User.create({_id: contributor.id, login: contributor.login})
          //   .catch(() => {/* ignore duplicate error */});
        }));
    });

    const completed = () => {
      if (status.added + status.updated + status.skipped === repos.length) {
        resolve({user: user, modified: status});
      }
    }
  });
};

const getRepos = () => {
  return new Promise((resolve, reject) => {
    Repo.find().populate('owner').sort({forks: -1}).limit(25)
      .exec((err, repos) => resolve(repos));
  });
};

const getUsers = () => {
  return new Promise((resolve, reject) => {
    User.find()
      .exec((err, users) => resolve(users));
  });
};

const getUserRepos = (id) => {
  return new Promise((resolve, reject) => {
    Repo.find({owner: id}).sort({forks: -1}).limit(10)
      .exec((err, repos) => resolve(repos));
  });
};

const getUserFriends = (user) => {
  return new Promise((resolve, reject) => {
    Contributor.find().populate({path: 'repo_id', populate: {path: 'owner'}})
      .exec((err, friends) => resolve(friends.filter(friend => user && friend.repo_id.owner._id === parseInt(user._id) && friend.repo_id.owner.login !== friend.login)));
  });
};

module.exports = {
  save: save,
  getRepos: getRepos,
  getUsers: getUsers,
  getUserRepos: getUserRepos,
  getUserFriends: getUserFriends
};