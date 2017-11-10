import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {HashRouter, Redirect, Link, Switch, Route, withRouter} from 'react-router-dom';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import UserList from './components/UserList.jsx';
import UserView from './components/UserView.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      repos: [],
      modified: {added: 0, updated: 0, skipped: 0},
      users: [],
      user: {}
    }

    this.updateRepos();
    this.updateUsers();
  }

  search (term) {
    $.post('/repos', {username: term})
      .then(({user, modified}) => {
        this.setState({modified: modified});
        this.updateRepos()
          .then(() => {
            this.setState({user: user});
            this.props.history.push(`/users/${user.login}`);
          });
        this.updateUsers();
      });
  }

  updateRepos() {
    return $.get('/repos')
      .then(results => this.setState({repos: results}));
  }

  updateUsers() {
    return $.get('/users')
      .then(results => this.setState({users: results}));
  }

  handleUserClick(user) {
    this.setState({user: user});
    this.props.history.push(`/users/${user.login}`);
  }

  render () {
    return (
      <div>
        <h1>Github Fetcher</h1>
        <span><Link to='/repos'>Repos</Link></span>&nbsp;&nbsp;
        <span><Link to='/users'>Users</Link></span>
        <Search onSearch={this.search.bind(this)}/>
        <h3>
          {`${this.state.modified.added == 0 ? '' : this.state.modified.added + ' new repos imported '} 
            ${this.state.modified.updated == 0 ? '' : this.state.modified.updated + ' repos updated '} 
            ${this.state.modified.skipped == 0 ? '' : this.state.modified.skipped + ' repos skipped'}`}
        </h3>
        <Switch>
          <Route path='/repos' render={routeProps => <RepoList repos={this.state.repos} />} />
          <Route path='/users/:user' render={routeProps => <UserView user={this.state.user} search={this.search.bind(this)} />} />
          <Route path='/users' render={routeProps => <UserList users={this.state.users} handleUserClick={this.handleUserClick.bind(this)} />} />
          <Redirect from='/' to='/repos' />
        </Switch>
      </div>
    )
  }
}

ReactDOM.render((
  <HashRouter>
     <Route path="/" component={App} />
  </HashRouter>
), document.getElementById('app'));