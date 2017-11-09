import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import UserList from './components/UserList.jsx';
import {HashRouter, Redirect, Link, Switch, Route} from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      repos: [],
      modified: {added: 0, updated: 0, skipped: 0},
      users: []
    }

    this.updateRepos();
    this.updateUsers();
  }

  search (term) {
    // console.log(`${term} was searched`);
    
    $.post('http://localhost:1128/repos', {username: term})
      .then(modified => {
        this.setState({modified: modified});
        this.updateRepos();
        this.updateUsers();
      });
  }

  updateRepos() {
    $.get('http://localhost:1128/repos')
      .then(results => this.setState({repos: results}));
  }

  updateUsers() {
    $.get('http://localhost:1128/users')
      .then(results => this.setState({users: results}));
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
          <Route path='/users' render={routeProps => <UserList users={this.state.users} />} />
          <Redirect from='/' to='/repos' />
        </Switch>
      </div>
    )
  }
}

ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('app'));