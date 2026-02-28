import React, { useEffect, useState } from "react";
import JobCard from "../jobs/JobCard";

export default function Companies() {
  const [search, setSearch] = useState(""); // New search state

  const [data, setData] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("Find Jobs Data")) || {
        jobs: [],
        companies: [],
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

  // Listen for login/logout/save updates
  useEffect(() => {
    const handleAuthChange = () => {
      const updatedData =
        JSON.parse(localStorage.getItem("Find Jobs Data")) || {
          jobs: [],
          companies: [],
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

  // Filter companies based on search input
  const filteredCompanies = data.companies.filter((company) =>
    company.brandName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 p-4 md:p-12 space-y-10">
      {/* Page Header with Responsive Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
        <h1 className="text-3xl font-bold text-gray-800">
          Companies & Jobs
        </h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for a company to view its jobs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-96 mt-2 md:mt-0"
        />
      </div>

      {filteredCompanies.map((company) => {
        const companyJobs = data.jobs.filter(
          (j) => j.companyId === company.companyId
        );

        if (!companyJobs.length) return null;

        return (
          <div key={company.companyId} className="space-y-6">
            {/* Company Title */}
            <h2
              className="text-2xl font-semibold"
              style={{ color: company.brandColor }}
            >
              {company.brandName}
            </h2>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  currentUser={currentUser}
                  data={data}
                  setData={setData}
                />
              ))}
            </div>
          </div>
        );
      })}

      {filteredCompanies.length === 0 && (
        <p className="text-gray-500">No companies found.</p>
      )}
    </div>
  );
}