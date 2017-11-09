import React from 'react';
import RepoListView from './RepoListView.jsx';

const RepoList = ({repos}) => (
  <div>
    <h4>Top {repos.length} repos by forks.</h4>
    {repos.map((repo, key) => <RepoListView repo={repo} key={key} />)}
  </div>
)

export default RepoList;