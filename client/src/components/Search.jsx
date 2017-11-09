import React from 'react';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }
  }

  onChange(e) {
    this.setState({
      term: e.target.value
    });
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.search();
    }
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  render() {
    return (<div>
      <h4>Add more repos!</h4>
      Enter a github username: <input value={this.state.terms} 
                                      onChange={e => this.onChange(e)}
                                      onKeyPress={e => this.onKeyPress(e)}
                                      />       
      <button onClick={() => this.search()}> Add Repos </button>
    </div>) 
  }
}

export default Search;