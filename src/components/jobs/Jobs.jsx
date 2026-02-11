import React, { useState } from "react";
import JobCard from "./JobCard";

export default function Jobs() {
  const data = JSON.parse(localStorage.getItem("Find Jobs Data")) || { jobs: [], others: [] };
  const isLoggedIn = !!data.others.find(o => o.type === "currentUser")?.data;

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const filteredJobs = data.jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter ? job.level === levelFilter : true;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 p-4 md:p-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Job Listings</h1>

      {/* Sidebar Filters */}
      <div className="flex flex-col md:flex-row gap-6">
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

        <div className="md:flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length ? (
            filteredJobs.map(job => (
              <JobCard key={job.id} job={job} isLoggedIn={isLoggedIn} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}