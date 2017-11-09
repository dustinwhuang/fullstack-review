import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      repos: []
    }

    this.updateRepos();
  }

  search (term) {
    console.log(`${term} was searched`);
    
    $.post('http://localhost:1128/repos', {username: term})
      .then(() => this.updateRepos());
  }

  updateRepos() {
    $.get('http://localhost:1128/repos')
      .then(results => this.setState({repos: results}));
  }

  render () {
    return (<div>
      <h1>Github Fetcher</h1>
      <Search onSearch={this.search.bind(this)}/>
      <RepoList repos={this.state.repos}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));