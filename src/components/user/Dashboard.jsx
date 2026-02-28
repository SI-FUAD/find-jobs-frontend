import { useState, useEffect } from "react";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(() => {
    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
    return data?.others.find(o => o.type === "currentUser")?.data || null;
  });

  const [data, setData] = useState(() => JSON.parse(localStorage.getItem("Find Jobs Data")) || {});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "" });

  const [modal, setModal] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    const handleAuthChange = () => {
      const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
      setCurrentUser(data?.others.find(o => o.type === "currentUser")?.data || null);
      setData(data || {});
    };

    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50 pt-24 px-4 md:px-12">
        <p className="text-gray-500 text-lg">No user logged in.</p>
      </div>
    );
  }

  // ======= Stats Calculation =======
  const userApplications = data.applications?.filter(app => app.userId === currentUser.userId) || [];
  const totalApplications = userApplications.length;
  const applied = userApplications.filter(a => a.status === "Applied").length;
  const shortlisted = userApplications.filter(a => a.status === "Shortlisted").length;
  const accepted = userApplications.filter(a => a.status === "Accepted").length;
  const rejected = userApplications.filter(a => a.status === "Rejected").length;
  const savedJobs = currentUser.savedJobs?.length || 0;

  const handlePasswordChange = () => {
  if (!passwordForm.current || !passwordForm.new) {
    setModal({ show: true, type: "error", message: "Please fill both fields" });
    return;
  }

  if (passwordForm.current !== currentUser.password) {
    setModal({ show: true, type: "error", message: "Current password does not match" });
    return;
  }

  // Update localStorage
  const usersCopy = data.users.map(u =>
    u.userId === currentUser.userId
      ? { ...u, password: passwordForm.new }
      : u
  );
  const othersCopy = data.others.map(o =>
    o.type === "currentUser"
      ? { ...o, data: { ...o.data, password: passwordForm.new } }
      : o
  );

  localStorage.setItem("Find Jobs Data", JSON.stringify({ ...data, users: usersCopy, others: othersCopy }));
  setData(prev => ({ ...prev, users: usersCopy, others: othersCopy }));

  setModal({ show: true, type: "success", message: "Password updated successfully!" });
  setPasswordForm({ current: "", new: "" });
  setShowPasswordForm(false);
};

  return (
    <div className="min-h-screen bg-blue-50 pt-24 md:pt-32 px-4 md:px-12 space-y-8">

      {/* ===== Page Title ===== */}
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Dashboard</h1>

      {/* ===== Profile Summary Card ===== */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

        {/* Left: User Info */}
        <div className="space-y-2">
          <p><span className="font-medium">User ID:</span> {currentUser.userId}</p>
          <p><span className="font-medium">Full Name:</span> {currentUser.firstName} {currentUser.lastName}</p>
          <p><span className="font-medium">Email:</span> {currentUser.email}</p>
          <p><span className="font-medium">Phone:</span> {currentUser.phone || "-"}</p>
          <p><span className="font-medium">Current Address:</span> {currentUser.currentAddress || "-"}</p>
        </div>

        {/* Right: Profile Completion Circle */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <circle className="text-gray-300" strokeWidth="4" stroke="currentColor" fill="none" cx="18" cy="18" r="16" />
            <circle
              className="text-blue-600"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              cx="18"
              cy="18"
              r="16"
              strokeDasharray="100, 100"
              strokeDashoffset={`${100 - (currentUser.profileCompletion || 0)}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-blue-600">
            {currentUser.profileCompletion || 0}%
          </div>
        </div>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="font-semibold text-gray-700">Total</p>
          <p className="text-blue-600 font-bold text-xl">{totalApplications}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="font-semibold text-gray-700">Applied</p>
          <p className="text-blue-600 font-bold text-xl">{applied}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="font-semibold text-gray-700">Saved</p>
          <p className="text-blue-600 font-bold text-xl">{savedJobs}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="font-semibold text-gray-700">Shortlisted</p>
          <p className="text-blue-600 font-bold text-xl">{shortlisted}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="font-semibold text-gray-700">Accepted</p>
          <p className="text-blue-600 font-bold text-xl">{accepted}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="font-semibold text-gray-700">Rejected</p>
          <p className="text-blue-600 font-bold text-xl">{rejected}</p>
        </div>
      </div>

      {/* ===== Password Change Section ===== */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4 max-w-md">
        <button
          onClick={() => setShowPasswordForm(prev => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          {showPasswordForm ? "Cancel Password Change" : "Change Password"}
        </button>

        {showPasswordForm && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Current Password</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={e => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">New Password</label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={e => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Save Password
            </button>
          </div>
        )}
      </div>

      {/* ===== Modal ===== */}
{modal.show && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center space-y-4">
      <h3 className={`text-lg font-semibold ${modal.type === "success" ? "text-green-600" : "text-red-600"}`}>
        {modal.type === "success" ? "Success" : "Error"}
      </h3>
      <p className="text-gray-700">{modal.message}</p>
      <button
        onClick={() => setModal(prev => ({ ...prev, show: false }))}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
      >
        OK
      </button>
    </div>
  </div>
)}
    </div>
  );
}