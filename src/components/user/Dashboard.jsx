import { useState, useEffect } from "react";

function Dashboard() {
  // Lazy initialization avoids synchronous setState in useEffect
  const [currentUser, setCurrentUser] = useState(() => {
    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
    return data?.others.find((o) => o.type === "currentUser")?.data || null;
  });

  // Optional effect for resync if auth changes (like login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
      setCurrentUser(data?.others.find((o) => o.type === "currentUser")?.data || null);
    };

    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-gray-500 text-lg">No user logged in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">User Info</h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">User ID:</span> {currentUser.userId}
          </p>
          <p>
            <span className="font-medium">First Name:</span> {currentUser.firstName}
          </p>
          <p>
            <span className="font-medium">Last Name:</span> {currentUser.lastName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {currentUser.email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;