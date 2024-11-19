import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import ConfirmationDialog from '../ConfirmRemove';

function GoogleUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();
  const [jwt, setJwt] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [UserRemove, setUserRemove] = useState(null);

  useEffect(() => {
    if (session?.user?.accessToken) {
      setJwt(session.user.accessToken);
    }
  }, [session]);

  useEffect(() => {
    const fetchGoogleUsers = async () => {
      try {
        const response = await fetch('/api/auth/googleUserLogin', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Google users');
        }

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (jwt) {
      fetchGoogleUsers();
    }
  }, [jwt]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user._id.toLowerCase().includes(query.toLowerCase())
      );
    });

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/auth/googleUserLogin/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      else{

      const updatedUser = await response.json();
       if(updatedUser.email===session?.user?.email){
        signOut()
       }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    
    }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleRemoveClick = (user) => {
    setUserRemove(user);
    setIsDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!UserRemove) return;
    try {
      const response = await fetch(`/api/auth/googleUserLogin/${UserRemove._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove the user.');
      }
      else{
     const deletedUser=await response.json()
     if(deletedUser.email===session?.user?.email){
      signOut()
     }
      // Update state to remove deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== UserRemove._id));
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.filter((user) => user._id !== UserRemove._id)
      );

      setIsDialogOpen(false); // Close the dialog
    }
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Failed to remove the user.');
    } finally {
      setUserRemove(null); // Reset selected user
    }
  };

  const cancelRemove = () => {
    setIsDialogOpen(false);
    setUserRemove(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 text-gray-500">
      <h1 className="text-2xl font-semibold mb-4">Admin - Google User Management</h1>

      {/* Search Input */}
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="px-4 py-2">{user._id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.lastName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                     
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  No users found.
                </td>
              </tr>
            )}
            <ConfirmationDialog
              isOpen={isDialogOpen}
              onConfirm={confirmRemove}
              onCancel={cancelRemove}
              message={`Are you sure you want to remove "${UserRemove?.name}"?`}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GoogleUser;
