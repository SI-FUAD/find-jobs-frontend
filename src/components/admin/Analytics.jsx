import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateFakeData } from "./fakeDataGenerator";

function Analytics() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const data = JSON.parse(localStorage.getItem("Find Jobs Data")) || {};

  const userCount = data?.users?.length || 0;
  const totalApplications = data?.applications?.length || 0;

  const uniqueAppliedUsers = [
    ...new Set(data?.applications?.map(app => app.userId))
  ].length || 0;

  const updatedApplications =
    data?.applications?.filter(app => app.dateUpdated !== null).length || 0;

  // 🔵 Import Fake Data
  const handleImportFakeData = () => {
    const fakeData = generateFakeData();

    const newData = {
      ...data,
      users: fakeData.users,
      companies: fakeData.companies,
      jobs: fakeData.jobs,
      applications: fakeData.applications,
    };

    localStorage.setItem("Find Jobs Data", JSON.stringify(newData));

    alert("Fake data imported successfully!");
    window.location.reload();
  };

  // 🔴 Clear All Data
  const handleClearAll = () => {
    localStorage.removeItem("Find Jobs Data");

    // Reinitialize
    localStorage.setItem(
      "Find Jobs Data",
      JSON.stringify({
        users: [],
        companies: [],
        jobs: [],
        applications: [],
        others: [
          {
            type: "admin",
            email: "admin@findjobs.com",
            password: "admin123",
          },
          {
            type: "currentUser",
            data: null
          }
        ],
      })
    );

    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="p-4 md:p-6">

      <h1 className="text-2xl font-bold mb-6">Admin Analytics</h1>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-lg">
            Total Registered Users:
            <span className="font-semibold ml-2">{userCount}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-lg">
            Total Applications:
            <span className="font-semibold ml-2">{totalApplications}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-lg">
            Users Who Applied:
            <span className="font-semibold ml-2">{uniqueAppliedUsers}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-lg">
            Applications Updated:
            <span className="font-semibold ml-2">{updatedApplications}</span>
          </p>
        </div>

      </div>

      {/* 🔧 Admin Controls */}
      <div className="flex flex-col sm:flex-row gap-4">

        <button
          onClick={handleImportFakeData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition w-full sm:w-auto"
        >
          Import Fake Data
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition w-full sm:w-auto"
        >
          Clear All Data
        </button>

      </div>

      {/* 🔴 Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="text-xl font-semibold mb-4">
              Confirm Clear All Data
            </h2>

            <p className="mb-6 text-gray-600">
              This will delete all users, companies, jobs, applications
              and log out the admin. Are you sure?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Analytics;