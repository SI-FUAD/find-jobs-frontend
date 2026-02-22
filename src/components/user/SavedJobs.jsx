import { useEffect, useState } from "react";
import JobCard from "../jobs/JobCard";

export default function SavedJobs() {
  const [data, setData] = useState(() => {
  return (
    JSON.parse(localStorage.getItem("Find Jobs Data")) || {
      jobs: [],
      others: [],
    }
  );
});

const [modal, setModal] = useState(null);

  // Listen for save/login/logout updates
  useEffect(() => {
  const handleAuthChange = () => {
    const updatedData =
      JSON.parse(localStorage.getItem("Find Jobs Data")) || {
        jobs: [],
        others: [],
        users: [],
      };

    setData(updatedData);
  };

  window.addEventListener("authChanged", handleAuthChange);

  return () => {
    window.removeEventListener("authChanged", handleAuthChange);
  };
}, []);

const currentUserId =
  data.others?.find((o) => o.type === "currentUser")?.data?.userId;

const currentUser =
  data.users?.find((u) => u.userId === currentUserId) || null;

  // If not logged in or not user
  if (!currentUser || currentUser.companyId || currentUser.email === "admin@findjobs.com") {
    return (
      <div className="min-h-screen pt-32 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">
          Access Restricted
        </h1>
        <p className="text-gray-600 mt-2">
          Only registered users can view saved jobs.
        </p>
      </div>
    );
  }

  // Filter saved jobs
  const savedJobList = data.jobs.filter((job) =>
    currentUser.savedJobs?.includes(job.id)
  );

  return (
  <>
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 p-4 md:p-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Saved Jobs
      </h1>

      {savedJobList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobList.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              currentUser={currentUser}
              data={data}
              setData={setData}
              onUnsave={() => setModal("removed")}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <p className="text-gray-600 text-lg">
            You have not saved any jobs yet.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Browse jobs and click "Save Job" to see them here.
          </p>
        </div>
      )}
    </div>

    {modal === "removed" && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold text-red-600 text-left">
            Job removed from saved jobs
          </h2>

          <button
            onClick={() => setModal(null)}
            className="w-full mt-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    )}
  </>
);
}