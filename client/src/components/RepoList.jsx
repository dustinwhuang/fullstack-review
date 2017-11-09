import React from 'react';
import RepoListView from './RepoListView.jsx';

const RepoList = ({repos}) => (
  <div>
    <h4> Repo List Component </h4>
    Top {repos.length} repos by forks.
    {repos.map((repo, key) => <RepoListView repo={repo} key={key} />)}
  </div>
)

export default RepoList;