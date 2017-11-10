import React from 'react';
import UserView from './UserView.jsx';

const UserListView = ({user, handleUserClick}) => (
  <div>
    <div className="username" onClick={e => handleUserClick(user)}>{user.login}</div>
  </div>
)

export default UserListView;