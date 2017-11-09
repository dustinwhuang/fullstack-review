import React from 'react';
import UserListView from './UserListView.jsx';

const UserList = ({users}) => (
  <div>
    <h4>All Users</h4>
    {users.map((user, key) => <UserListView user={user} key={key} />)}
  </div>
)

export default UserList;