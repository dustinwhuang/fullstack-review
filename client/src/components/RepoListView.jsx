import React from 'react';

const RepoListView = ({repo: {name, owner, url, description, forks}}) => (
  <div>
    <a href={url}><h3>{name} {`${owner.login ? 'by ' + owner.login : ''}`} ({forks} forks)</h3></a>
    <ul>
      <li>{description ? description : 'No description, website, or topics provided.'}</li>
    </ul>
  </div>
)

export default RepoListView;