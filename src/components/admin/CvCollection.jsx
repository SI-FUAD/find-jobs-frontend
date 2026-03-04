import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getSimilarTitles } from "../home/jobTitleUtils";

export default function CvCollection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // ---------------- Users from localStorage ----------------
  const users = useMemo(() => {
    const storedData = JSON.parse(localStorage.getItem("Find Jobs Data")) || { users: [] };
    return storedData.users || [];
  }, []); // memoized once

  // ---------------- Filter Users by Title ----------------
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    const lowerSearch = search.toLowerCase();
    const similarTitles = getSimilarTitles(lowerSearch);

    return users.filter(user => {
      const title = (user.careerTitle || "").toLowerCase();

      // Proper search:
      // 1. Check if the typed search text is in the title
      // 2. OR if any similar title matches
      return (
        title.includes(lowerSearch) ||
        similarTitles.some(simTitle => title.includes(simTitle.toLowerCase()))
      );
    });
  }, [users, search]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-green-50 min-h-screen rounded-t-3xl p-4 md:p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          CV Collection
        </h1>

        {/* Search by Title */}
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[500px] px-4 py-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white mb-6"
        />

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-green-100">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Title</th>
                <th className="p-3">Profile Completion</th>
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
                  <tr key={user.userId} className="border-t hover:bg-green-50 transition">
                    <td className="p-3 font-mono">{user.userId}</td>
                    <td className="p-3 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="p-3">{user.careerTitle || "-"}</td>
                    <td className="p-3">{user.profileCompletion || 0}%</td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate(`/admin/view-cv/${user.userId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        View CV
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map(user => (
            <div key={user.userId} className="bg-white rounded-2xl p-4 shadow-md hover:bg-green-100 transition">
              <div className="text-sm font-mono text-gray-500">
                <b>User ID:</b> {user.userId}
              </div>

              <h2 className="text-xl font-semibold mt-1">
                {user.firstName} {user.lastName}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                <b>Title:</b> {user.careerTitle || "-"}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                <b>Profile Completion:</b> {user.profileCompletion || 0}%
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/admin/view-cv/${user.userId}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
                >
                  View CV
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}