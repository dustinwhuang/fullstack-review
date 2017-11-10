import React from 'react';
import $ from 'jquery';
import RepoListView from './RepoListView.jsx';
import {withRouter} from 'react-router-dom';

class UserView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repos: [],
      friends: [],
      user: ''
    }

    if (props.user._id) {
      this.updateUserRepos(props.user);
      this.updateUserFriends(props.user);
    } else {
    $.get('http://localhost:1128/users')
      .then(results => results.find(result => result.login === window.location.hash.match(/\/users\/(.*)/)[1]))
      .then(user => {
        this.state.user = user;
        this.updateUserRepos(user);
        this.updateUserFriends(user);
      });
    }
  }

  updateUserRepos(user) {
    return $.get('http://localhost:1128/user', {user: user})
      .then(results => this.setState({repos: results}));
  }

  updateUserFriends(user) {
    return $.get('http://localhost:1128/user/friends', {user: user})
      .then(results => this.setState({friends: results}));
  }

  render() {
    return (
      <div>
        <a href={`https://github.com/${this.props.user.login}`}><h2>{this.props.user.login || this.state.user.login}</h2></a>
          <select onChange={e => location = `https://github.com/${e.target.value}`}
                  onClick={() => this.updateUserFriends(this.props.user)}
                  >
            <option>Friends</option>
            {this.state.friends.map(({login}, key) => <option value={login} key={key}>{login}</option>)}
          </select>
        {this.state.repos.map((repo, key) => <RepoListView repo={repo} key={key} />)}
      </div>
    )
  }
}

export default UserView;