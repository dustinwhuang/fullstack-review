import React from 'react';
import $ from 'jquery';
import RepoListView from './RepoListView.jsx';

class UserView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repos: [],
      friends: [],
      user: ''
    }

    let username = window.location.hash.match(/\/users\/(.*)/)[1];
    if (props.user.login && props.user.login === username) {
      this.updateUserRepos(props.user);
      this.updateUserFriends(props.user);
    } else {
      $.get('/users')
        .then(results => results.find(result => result.login === username))
        .then(user => {
          this.state.user = user;
          this.updateUserRepos(user);
          this.updateUserFriends(user);
        });
    }
  }

  // Rerender on select
  componentWillReceiveProps(nextProps) {
    let username = window.location.hash.match(/\/users\/(.*)/)[1];
    $.get('/users')
      .then(results => results.find(result => result.login === username))
      .then(user => {
        this.updateUserRepos(user)
          .then(this.setState({user: user}));
        this.updateUserFriends(user);
      });
  }

  updateUserRepos(user) {
    return $.get('/user', {user: user})
      .then(results => this.setState({repos: results}));
  }

  updateUserFriends(user) {
    return $.get('/user/friends', {user: user})
      .then(results => this.setState({friends: results}));
  }

  render() {
    return (
      <div>
        <h2><a href={`https://github.com/${this.state.user.login || this.props.user.login}`}>{this.state.user.login || this.props.user.login}</a></h2>
          <select onChange={e => this.props.search(e.target.value)}>
            <option>Friends</option>
            {this.state.friends.map(({login}, key) => <option value={login} key={key}>{login}</option>)}
          </select>
        {this.state.repos.map((repo, key) => <RepoListView repo={repo} key={key} />)}
      </div>
    )
  }
}

export default UserView;