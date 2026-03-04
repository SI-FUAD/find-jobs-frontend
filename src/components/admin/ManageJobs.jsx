import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageJobs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // ================= DATE FORMAT =================
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // ================= EXPIRY CHECK =================
  const isExpired = (deadline) =>
    new Date(deadline) <
    new Date(new Date().toISOString().split("T")[0]);

  // ================= LOAD DATA =================
  const { jobs, companies } = useMemo(() => {
    const stored =
      JSON.parse(localStorage.getItem("Find Jobs Data")) || {
        jobs: [],
        companies: [],
      };

    return {
      jobs: stored.jobs || [],
      companies: stored.companies || [],
    };
  }, []);

  // ================= ENRICH JOBS =================
  const jobsWithCompany = useMemo(() => {
    return jobs.map((job) => {
      const company = companies.find(
        (c) => c.companyId === job.companyId
      );

      return {
        ...job,
        companyName:
          job.companyName || company?.brandName || "Unknown",
      };
    });
  }, [jobs, companies]);

  // ================= STATS =================
  const totalJobs = jobsWithCompany.length;
  const totalExpired = jobsWithCompany.filter((j) =>
    isExpired(j.deadline)
  ).length;
  const totalActive = totalJobs - totalExpired;

  // ================= FILTER + SEARCH =================
  const filteredJobs = useMemo(() => {
    let filtered = jobsWithCompany;

    if (filter === "Active")
      filtered = filtered.filter((j) => !isExpired(j.deadline));

    if (filter === "Expired")
      filtered = filtered.filter((j) => isExpired(j.deadline));

    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((job) =>
        job.id?.toLowerCase().includes(lower) ||
        job.title?.toLowerCase().includes(lower) ||
        job.companyId?.toLowerCase().includes(lower) ||
        job.companyName?.toLowerCase().includes(lower) ||
        job.location?.toLowerCase().includes(lower)
      );
    }

    return filtered;
  }, [jobsWithCompany, search, filter]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-green-50 min-h-screen rounded-t-3xl p-4 md:p-6">

        {/* ================= TITLE ================= */}
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Manage Jobs
        </h1>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Jobs" value={totalJobs} />
          <StatCard title="Active Jobs" value={totalActive} />
          <StatCard title="Expired Jobs" value={totalExpired} />
        </div>

        {/* ================= FILTER + SEARCH ================= */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Expired"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                className={`w-28 h-10 rounded-lg text-sm font-medium ${
                  filter === type
                    ? "bg-green-600 text-white"
                    : "bg-white border border-green-400 text-green-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <input
              type="text"
              placeholder={`Search in ${filter}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-[400px] px-4 py-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
            />
          </div>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-green-100">
              <tr>
                <th className="p-3">Job ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Company</th>
                <th className="p-3">Location</th>
                <th className="p-3">Vacancy</th>
                <th className="p-3">Posted</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    No jobs found
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const expired = isExpired(job.deadline);

                  return (
                    <tr
                      key={job.id}
                      className={`border-t transition hover:bg-gray-200 ${
                        expired ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="p-3 font-mono">{job.id}</td>
                      <td className="p-3 font-medium">{job.title}</td>
                      <td className="p-3">
                        {job.companyName}
                        <div className="text-xs text-gray-500">
                          {job.companyId}
                        </div>
                      </td>
                      <td className="p-3">{job.location}</td>
                      <td className="p-3">{job.vacancy}</td>
                      <td className="p-3">
                        {formatDate(job.datePosted)}
                      </td>
                      <td className="p-3 text-red-600 font-semibold">
                        {formatDate(job.deadline)}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/job-details/${job.id}`)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4">
          {filteredJobs.length === 0 ? (
            <p className="text-center text-gray-500">
              No jobs found
            </p>
          ) : (
            filteredJobs.map((job) => {
              const expired = isExpired(job.deadline);

              return (
                <div
                  key={job.id}
                  className={`rounded-2xl p-4 shadow-md transition hover:bg-gray-200 ${
                    expired ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="text-sm font-mono text-gray-500">
                    <b>Job ID:</b> {job.id}
                  </div>

                  <h2 className="text-xl font-semibold mt-1">
                    {job.title}
                  </h2>

                  <p className="text-sm text-gray-600 mt-1">
                    <b>Company:</b> {job.companyName}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    <b>Company ID:</b> {job.companyId}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    <b>Location:</b> {job.location}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    <b>Vacancy:</b> {job.vacancy}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    <b>Posted:</b> {formatDate(job.datePosted)}
                  </p>

                  <p className="text-sm mt-1 text-red-600 font-semibold">
                    Deadline: {formatDate(job.deadline)}
                  </p>

                  <div className="mt-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/job-details/${job.id}`)
                      }
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-green-700">{value}</p>
    </div>
  );
}