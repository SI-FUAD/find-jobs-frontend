import { useEffect, useState } from "react";
import JobCard from "../jobs/JobCard";

export default function AppliedJobs() {
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("Find Jobs Data")) || {}
  );

  const currentUser =
    data?.others?.find((o) => o.type === "currentUser")?.data || null;

  // Get all applications of current user
  const userApplications =
    data?.applications?.filter(
      (app) => app.userId === currentUser?.userId
    ) || [];

  // Get full job objects from those applications
  const appliedJobs =
    userApplications
      .map((app) =>
        data?.jobs?.find((job) => job.id === app.jobId)
      )
      .filter(Boolean) || [];

  // Sync when localStorage updates
  useEffect(() => {
    const sync = () => {
      setData(
        JSON.parse(localStorage.getItem("Find Jobs Data")) || {}
      );
    };

    window.addEventListener("storage", sync);
    window.addEventListener("authChanged", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("authChanged", sync);
    };
  }, []);

  if (!currentUser)
    return (
      <div className="p-6 text-center text-lg">
        Please login to view applied jobs.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Applied Jobs
      </h1>

      {appliedJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
          You haven’t applied to any jobs yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliedJobs.map((job) => (
  <JobCard
  key={job.id}
  job={job}
  currentUser={currentUser}
  data={data}
  setData={setData}
/>))}
        </div>
      )}
    </div>
  );
}