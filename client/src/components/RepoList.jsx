import React from 'react';
import RepoListView from './RepoListView.jsx';

const RepoList = ({repos, modified:{added, updated, skipped}}) => (
  <div>
    <h3>{`${added == 0 ? '' : added + ' new repos imported '} ${updated == 0 ? '' : updated + ' repos updated '} ${skipped == 0 ? '' : skipped + ' repos skipped'}`}</h3>
    <h4>Top {repos.length} repos by forks.</h4>
    {repos.map((repo, key) => <RepoListView repo={repo} key={key} />)}
  </div>
)

export default RepoList;