function ManageUsers() {
  const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
  const users = data?.users || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">User ID</th>
              <th className="p-3 border">First Name</th>
              <th className="p-3 border">Last Name</th>
              <th className="p-3 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="p-3 border">{user.userId}</td>
                  <td className="p-3 border">{user.firstName}</td>
                  <td className="p-3 border">{user.lastName}</td>
                  <td className="p-3 border">{user.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;