import { useState, useEffect } from "react";
import JobCard from "./JobCard";

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const [data, setData] = useState(() => {
  return (
    JSON.parse(localStorage.getItem("Find Jobs Data")) || {
      jobs: [],
      others: [],
    }
  );
});

const [currentUser, setCurrentUser] = useState(() => {
  const stored =
    JSON.parse(localStorage.getItem("Find Jobs Data")) || {
      others: [],
    };

  return (
    stored.others?.find((o) => o.type === "currentUser")?.data || null
  );
});

  // Listen for login/logout/save changes
  useEffect(() => {
    const handleAuthChange = () => {
      const updatedData =
        JSON.parse(localStorage.getItem("Find Jobs Data")) || {
          jobs: [],
          others: [],
        };

      setData(updatedData);

      const user =
        updatedData.others?.find((o) => o.type === "currentUser")?.data || null;

      setCurrentUser(user);
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  const filteredJobs = data.jobs.filter((job) => {
    const matchesSearch = job.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesLevel = levelFilter
      ? job.level === levelFilter
      : true;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 p-4 md:p-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        All Job Listings
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="md:w-1/4 space-y-4">
          <input
            type="text"
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">All Levels</option>
            <option>Fresher</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior</option>
          </select>
        </div>

        {/* Job Cards */}
        <div className="md:flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length ? (
            filteredJobs.map((job) => (
              <JobCard
  key={job.id}
  job={job}
  currentUser={currentUser}
  data={data}
  setData={setData}
/>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No jobs found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}