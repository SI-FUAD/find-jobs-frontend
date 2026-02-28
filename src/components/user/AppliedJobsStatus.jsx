import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBriefcase,
  FaMoneyBillAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function AppliedJobsStatus() {
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("Find Jobs Data")) || {}
  );
  const [filter, setFilter] = useState("All");

  const currentUser =
    data?.others?.find((o) => o.type === "currentUser")?.data || null;

  useEffect(() => {
    const sync = () =>
      setData(JSON.parse(localStorage.getItem("Find Jobs Data")) || {});
    window.addEventListener("storage", sync);
    window.addEventListener("authChanged", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("authChanged", sync);
    };
  }, []);

  if (!currentUser) {
    return (
      <div className="p-6 text-center text-lg">
        Please login to view your applications.
      </div>
    );
  }

  const userApplications =
    data?.applications?.filter(
      (app) => app.userId === currentUser.userId
    ) || [];

  const appsWithJobData = userApplications.map((app) => {
    const job = data.jobs?.find((j) => j.id === app.jobId) || {};
    const company =
      data.companies?.find((c) => c.companyId === job.companyId) || {};

    return {
      ...app,
      job,
      company,
      companyName:
        company.companyName || job.companyName || "Unknown Company",
      brandColor:
        company.brandColor || job.brandColor || "#3B82F6",
    };
  });

  // ✅ STATS CALCULATION
  const stats = {
    total: appsWithJobData.length,
    applied: appsWithJobData.filter((a) => a.status === "Applied").length,
    shortlisted: appsWithJobData.filter((a) => a.status === "Shortlisted").length,
    accepted: appsWithJobData.filter((a) => a.status === "Accepted").length,
    rejected: appsWithJobData.filter((a) => a.status === "Rejected").length,
  };

  const filteredApps = appsWithJobData.filter((app) =>
    filter === "All" ? true : app.status === filter
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const statusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-600";
      case "Shortlisted":
        return "bg-yellow-500";
      case "Accepted":
        return "bg-green-600";
      case "Rejected":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 pt-24 md:pt-32 px-4 md:px-12">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        My Applications
      </h1>

      {/* ✅ STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Applied" value={stats.total} color="bg-gray-800" />
        <StatCard title="Applied" value={stats.applied} color="bg-blue-600" />
        <StatCard title="Shortlisted" value={stats.shortlisted} color="bg-yellow-500" />
        <StatCard title="Accepted" value={stats.accepted} color="bg-green-600" />
        <StatCard title="Rejected" value={stats.rejected} color="bg-red-600" />
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Applied", "Shortlisted", "Accepted", "Rejected"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`w-32 h-10 text-sm font-medium rounded-lg ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-blue-400 text-blue-700"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Application cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow p-6 text-center text-gray-600">
            No applications found for "{filter}".
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition flex flex-col h-full"
            >
              <div className="space-y-4">
                <div
                  className="inline-block px-4 py-2 text-white font-semibold text-sm tracking-wide rounded-md"
                  style={{ backgroundColor: app.brandColor }}
                >
                  {app.companyName}
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {app.job.title || "Unknown Job"}
                </h2>

                {app.job.location && (
                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <FaMapMarkerAlt /> {app.job.location}
                  </p>
                )}

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[72px]">
                  {app.job.description || "No description available."}
                </p>

                <div className="flex flex-wrap gap-2 text-gray-700 text-sm mb-2">
                  <p>
                    <strong>Application ID:</strong> {app.id}
                  </p>
                  <p>
                    <strong>Job ID:</strong> {app.jobId}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700 text-sm pt-3 border-t">
                  <p className="flex items-center gap-2">
                    <FaUsers /> Vacancy: {app.job.vacancy || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaBriefcase /> Experience: {app.job.experience || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMoneyBillAlt /> Salary:{" "}
                    {app.job.salary || "Negotiable"}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-gray-600 text-sm">
                    <p>
                      <strong>Date Applied:</strong>{" "}
                      {formatDate(app.dateApplied)}
                    </p>
                    <p>
                      <strong>Date Updated:</strong>{" "}
                      {formatDate(app.dateUpdated)}
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${statusColor(
                      app.status
                    )}`}
                    disabled
                  >
                    {app.status}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ✅ Reusable Stat Card Component
function StatCard({ title, value, color }) {
  return (
    <div className={`rounded-xl p-4 text-white shadow-md ${color}`}>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}