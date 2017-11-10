import React from 'react';

const RepoListView = ({repo: {name, owner, url, description, forks}}) => (
  <div>
    <div className="repo-name"><a href={url}>{name} {`${owner.login ? 'by ' + owner.login : ''}`} ({forks} forks)</a></div>
    <div className="repo-description">{description ? description : 'No description, website, or topics provided.'}</div>
  </div>
)

export default RepoListView;