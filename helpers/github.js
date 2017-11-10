const request = require('request');
// const config = require('../config.js');

let getReposByUsername = (username) => {
  // TODO - Use the request module to request repos for a specific
  // user from the github API

  // The options object has been provided to help you out, 
  // but you'll have to fill in the URL
  return new Promise((resolve, reject) => {
    let options = {
      url: `https://api.github.com/users/${username}/repos`,
      headers: {
        'User-Agent': 'request',
        'Authorization': `token ${process.env.TOKEN}`
      }
    };

    request(options, (err, res, body) => {
      if (res.statusCode === 200){
        resolve(JSON.parse(body));
      } else {
        reject('No repos found github');
      }
    });
  });
}

const getContributors = (url) => {
  return new Promise((resolve, reject) => {
    let options = {
      url: url,
      headers: {
        'User-Agent': 'request',
        'Authorization': `token ${process.env.TOKEN}`
      }
    };

    request(options, (err, res, body) => {
      if (res.statusCode === 200){
        resolve(JSON.parse(body));
      } else {
        reject('Error ');
      }
    });
  });
}

module.exports = {
  getReposByUsername: getReposByUsername,
  getContributors: getContributors
}