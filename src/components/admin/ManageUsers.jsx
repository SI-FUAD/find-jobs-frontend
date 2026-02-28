import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const navigate = useNavigate();
  const users = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem("Find Jobs Data")) || { users: [] };
    return stored.users || [];
  }, []);
  const [search, setSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    const lower = search.toLowerCase();

    return users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        user.userId?.toLowerCase().includes(lower) ||
        fullName.includes(lower) ||
        user.email?.toLowerCase().includes(lower) ||
        (user.phone || "").toLowerCase().includes(lower)
      );});}, [users, search]);

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const stored = JSON.parse(localStorage.getItem("Find Jobs Data")) || { users: [] };
    const updatedUsers = stored.users.filter(user => user.userId !== userToDelete);
    localStorage.setItem("Find Jobs Data", JSON.stringify({ ...stored, users: updatedUsers }));
    setShowDeleteConfirm(false);
    setUserToDelete(null);
    window.location.reload();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-50 min-h-screen rounded-t-3xl p-4 md:p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Manage Users
          </h1>

          <input
            type="text"
            placeholder="Search by ID, name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[500px] px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr
                    key={user.userId}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="p-3 font-mono">{user.userId}</td>
                    <td className="p-3 font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone || "-"}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/view-cv/${user.userId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        View CV
                      </button>

                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map(user => (
            <div
              key={user.userId}
              className="bg-white rounded-2xl p-4 shadow-md hover:bg-blue-100 transition"
            >
              <div className="text-sm font-mono text-gray-500">
                <b>User ID:</b> {user.userId}
              </div>

              <h2 className="text-xl font-semibold mt-1">
                {user.firstName} {user.lastName}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                <b>Email:</b> {user.email}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                <b>Phone:</b> {user.phone || "-"}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/admin/view-cv/${user.userId}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
                >
                  View CV
                </button>

                <button
                  onClick={() => handleDelete(user.userId)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
              <h3 className="text-xl font-semibold text-gray-700">
                Are you sure?
              </h3>
              <p className="text-gray-500 mt-2">
                You are about to permanently delete this user.
              </p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}