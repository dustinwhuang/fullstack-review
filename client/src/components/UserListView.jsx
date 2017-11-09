import React from 'react';
import $ from 'jquery';
import RepoListView from './RepoListView.jsx';

class UserListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repos: [],
      friends: []
    }

    this.updateUserRepos(props.user);
    this.updateUserFriends(props.user);
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
        <a href={`https://github.com/${this.props.user.login}`}><h2>{this.props.user.login}</h2></a>
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

export default UserListView;