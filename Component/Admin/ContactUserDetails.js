import React, { useState, useEffect } from "react";
import ConfirmationDialog from "../ConfirmRemove";
import { useSession } from "next-auth/react";
import LoadingPage from "../LoadingPage";
function Contact() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contactToRemove, setContactToRemove] = useState(null);

  const { data: session, status } = useSession();
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    if (session?.user?.accessToken) {
      setJwt(session?.user?.accessToken);
    }
  }, [session]);

  // Fetch contacts
  useEffect(() => {
    if (jwt) {
      const fetchContacts = async () => {
        try {
          const response = await fetch("/api/admin/contactus", {
            headers: { Authorization: `Bearer ${jwt}` },
          });
          if (!response.ok) throw new Error("Failed to fetch contacts");

          const data = await response.json();
          console.log(data);
          setContacts(data);
          setFilteredContacts(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchContacts();
    }
  }, [jwt]);

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = contacts.filter((contact) =>
      ["name", "email", "message", "_id"].some((key) =>
        contact[key]?.toLowerCase().includes(query.toLowerCase())
      )
    );

    setFilteredContacts(filtered);
  };

  // Handle contact removal confirmation dialog
  const handleRemoveClick = (contact) => {
    setContactToRemove(contact);
    setIsDialogOpen(true);
  };

  // Confirm contact removal
  const confirmRemove = async () => {
    if (!contactToRemove) return;

    try {
      const response = await fetch(
        `/api/admin/contactus/${contactToRemove._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to remove contact");

      setContacts((prev) =>
        prev.filter((contact) => contact._id !== contactToRemove._id)
      );
      setFilteredContacts((prev) =>
        prev.filter((contact) => contact._id !== contactToRemove._id)
      );

      setIsDialogOpen(false);
    } catch (err) {
      console.error(err.message);
      alert("Error removing contact");
    } finally {
      setContactToRemove(null);
    }
  };

  // Cancel contact removal
  const cancelRemove = () => {
    setIsDialogOpen(false);
    setContactToRemove(null);
  };

  if (status === "loading") {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-6 text-gray-500">
      <h1 className="text-2xl font-semibold mb-4">Contact Management</h1>

      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Name, Email, or Message"
          className="px-4 py-2 w-full border rounded-lg shadow-md"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts?.map((contact) => (
              <tr key={contact._id} className="border-b">
                <td className="px-4 py-2">{contact._id}</td>
                <td className="px-4 py-2">{contact.name}</td>
                <td className="px-4 py-2">{contact.email}</td>
                <td className="px-4 py-2">{contact.message}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleRemoveClick(contact)}
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
        message={`Are you sure you want to remove "${contactToRemove?.name}"?`}
      />
    </div>
  );
}

export default Contact;
