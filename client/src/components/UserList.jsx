import React from 'react';
import UserListView from './UserListView.jsx';

const UserList = ({users, handleUserClick}) => (
  <div>
    <h4>All Users</h4>
    {users.map((user, key) => <UserListView user={user} key={key} handleUserClick={handleUserClick} />)}
  </div>
)

export default UserList;