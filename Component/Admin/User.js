import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import ConfirmationDialog from '../ConfirmRemove';

function User() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jwt, setJwt] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const { data: session } = useSession();

  // Set JWT from session
  useEffect(() => {
    if (session?.user?.accessToken) {
      setJwt(session.user.accessToken);
    }
  }, [session]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/auth/register', {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (jwt) fetchUsers();
  }, [jwt]);

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = users.filter((user) =>
      ['name', 'lastName', 'email', '_id']
        .some((key) => user[key]?.toLowerCase().includes(query.toLowerCase()))
    );

    setFilteredUsers(filtered);
  };

  // Update role and handle logout if necessary
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/auth/register/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error('Failed to update user role');

      const updatedUser = await response.json();

      if (updatedUser.email === session?.user?.email) {
        alert('Your role has been updated. Logging out...');
        signOut();
      }

      setUsers((prev) =>
        prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      setFilteredUsers((prev) =>
        prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
    } catch (err) {
      console.error(err.message);
      alert('Error updating user role');
    }
  };

  // Handle user removal confirmation dialog
  const handleRemoveClick = (user) => {
    setUserToRemove(user);
    setIsDialogOpen(true);
  };

  // Confirm user removal
  const confirmRemove = async () => {
    if (!userToRemove) return;

    try {
      const response = await fetch(`/api/auth/register/${userToRemove._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!response.ok) throw new Error('Failed to remove user');

      if (userToRemove.email === session?.user?.email) {
        alert('Your account has been removed. Logging out...');
        signOut();
      }

      setUsers((prev) => prev.filter((user) => user._id !== userToRemove._id));
      setFilteredUsers((prev) =>
        prev.filter((user) => user._id !== userToRemove._id)
      );

      setIsDialogOpen(false);
    } catch (err) {
      console.error(err.message);
      alert('Error removing user');
    } finally {
      setUserToRemove(null);
    }
  };

  // Cancel user removal
  const cancelRemove = () => {
    setIsDialogOpen(false);
    setUserToRemove(null);
  };

  if (loading) {
    return <div className="text-center p-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 text-gray-500">
      <h1 className="text-2xl font-semibold mb-4">Admin - User Management</h1>

      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Name, Email, ID, or Last Name"
          className="px-4 py-2 w-full border rounded-lg shadow-md"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Last Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-2">{user._id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.lastName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={user.role || 'user'}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    className="px-2 py-1 border rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleRemoveClick(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        message={`Are you sure you want to remove "${userToRemove?.name}"?`}
      />
    </div>
  );
}

export default User;
