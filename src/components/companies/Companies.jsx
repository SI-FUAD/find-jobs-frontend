import React, { useEffect, useState, useMemo } from "react";
import JobCard from "../jobs/JobCard";

export default function Companies() {
  const [search, setSearch] = useState("");

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

  // ================= ACTIVE JOBS ONLY =================
  // Fix: today moved inside useMemo

  const activeJobs = useMemo(() => {
    const today = new Date();

    return data.jobs.filter((job) => {
      if (!job.deadline) return false;
      return new Date(job.deadline) >= today;
    });
  }, [data.jobs]);

  // ================= FILTER COMPANIES =================

  const filteredCompanies = useMemo(() => {
    return data.companies.filter((company) => {
      const companyActiveJobs = activeJobs.filter(
        (j) => j.companyId === company.companyId
      );

      if (!companyActiveJobs.length) return false;

      return company.brandName
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [data.companies, activeJobs, search]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 p-4 md:p-12 space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
        <h1 className="text-3xl font-bold text-gray-800">
          Companies & Their Active Job Opportunities
        </h1>

        <input
          type="text"
          placeholder="Search for a company to view its active jobs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-96 mt-2 md:mt-0"
        />
      </div>

      {filteredCompanies.map((company) => {
        const companyActiveJobs = activeJobs.filter(
          (j) => j.companyId === company.companyId
        );

        const activeCount = companyActiveJobs.length;

        return (
          <div key={company.companyId} className="space-y-6">

            {/* Company Title + Active Count */}
            <div className="flex items-center gap-3 flex-wrap">
  <h2
    className="text-2xl font-bold"
    style={{ color: company.brandColor }}
  >
    {company.brandName}
  </h2>

  <span
    className="text-2xl font-bold"
    style={{ color: company.brandColor }}
  >
    ({activeCount} Active {activeCount === 1 ? "Job" : "Jobs"})
  </span>
</div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyActiveJobs.map((job) => (
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
        <p className="text-gray-500">
          No companies with active job listings found.
        </p>
      )}
    </div>
  );
}