import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ManageApplications() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const stored =
    JSON.parse(localStorage.getItem("Find Jobs Data")) || {
      applications: [],
      jobs: [],
      companies: [],
    };

  const [applications, setApplications] = useState(
    stored.applications || []
  );

  /* ================= URL PARAMS ================= */
  const filter = searchParams.get("filter") || "All";
  const search = searchParams.get("search") || "";

  const setFilter = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", value);
    setSearchParams(params);
  };

  const setSearch = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  /* ================= ENRICH APPLICATIONS WITH JOB + COMPANY ================= */
  const enrichedApplications = applications.map((app) => {
    const job = stored.jobs?.find((j) => j.id === app.jobId) || {};
    const company = stored.companies?.find(
      (c) => c.companyId === job.companyId
    ) || {};

    return {
      ...app,
      job,
      company,
      companyId: company.companyId || job.companyId || "-",
      companyName: company.companyName || job.companyName || "Unknown Company",
      brandColor: company.brandColor || job.brandColor || "#3B82F6",
    };
  });

  /* ================= FILTER LOGIC ================= */
  let filtered = enrichedApplications;

  if (filter === "Applied")
    filtered = filtered.filter((a) => a.status === "Applied");

  if (filter === "Shortlisted")
    filtered = filtered.filter((a) => a.status === "Shortlisted");

  if (filter === "Accepted")
    filtered = filtered.filter((a) => a.status === "Accepted");

  if (filter === "Rejected")
    filtered = filtered.filter((a) => a.status === "Rejected");

  if (filter === "Pending")
    filtered = filtered.filter(
      (a) => a.status === "Applied" || a.status === "Shortlisted"
    );

  if (filter === "Completed")
    filtered = filtered.filter(
      (a) => a.status === "Accepted" || a.status === "Rejected"
    );

  if (search.trim()) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.id?.toLowerCase().includes(lower) ||
        app.jobId?.toLowerCase().includes(lower) ||
        app.userId?.toLowerCase().includes(lower) ||
        app.companyId?.toLowerCase().includes(lower) ||
        app.companyName?.toLowerCase().includes(lower)
    );
  }

  /* ================= STATS ================= */
  const total = applications.length;
  const applied = applications.filter((a) => a.status === "Applied").length;
  const shortlisted = applications.filter(
    (a) => a.status === "Shortlisted"
  ).length;
  const accepted = applications.filter((a) => a.status === "Accepted").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;
  const pending = applied + shortlisted;
  const completed = accepted + rejected;

  /* ================= DATE FORMAT ================= */
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  /* ================= STATUS UPDATE ================= */
  const updateStatus = (id, newStatus) => {
    const updated = applications.map((app) =>
      app.id === id
        ? {
            ...app,
            status: newStatus,
            dateUpdated: new Date().toISOString(),
          }
        : app
    );

    setApplications(updated);

    localStorage.setItem(
      "Find Jobs Data",
      JSON.stringify({ ...stored, applications: updated })
    );
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setApplicationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const updated = applications.filter((app) => app.id !== applicationToDelete);

    setApplications(updated);

    localStorage.setItem(
      "Find Jobs Data",
      JSON.stringify({ ...stored, applications: updated })
    );

    setShowDeleteConfirm(false);
    setApplicationToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setApplicationToDelete(null);
  };

  /* ================= STATUS COLOR ================= */
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

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-green-50 min-h-screen rounded-t-3xl p-4 md:p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Manage Applications
        </h1>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total" value={total} />
          <StatCard title="Applied" value={applied} />
          <StatCard title="Shortlisted" value={shortlisted} />
          <StatCard title="Accepted" value={accepted} />
          <StatCard title="Rejected" value={rejected} />
          <StatCard title="Pending" value={pending} />
          <StatCard title="Completed" value={completed} />
        </div>

        {/* ================= FILTER + SEARCH ================= */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {["All","Applied","Shortlisted","Accepted","Rejected","Pending","Completed"]
              .map((type) => (
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
                <th className="p-3">Application ID</th>
                <th className="p-3">Job ID</th>
                <th className="p-3">Company ID</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Applied</th>
                <th className="p-3">Updated</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-t hover:bg-green-50 transition">
                  <td className="p-3 font-mono">{app.id}</td>
                  <td className="p-3 font-mono">{app.jobId}</td>
                  <td className="p-3 font-mono">{app.companyId}</td>
                  <td className="p-3 font-mono">{app.userId}</td>
                  <td className="p-3">
                    <button
                      className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${statusColor(app.status)}`}
                      disabled
                    >
                      {app.status}
                    </button>
                  </td>
                  <td className="p-3">{formatDate(app.dateApplied)}</td>
                  <td className="p-3">{formatDate(app.dateUpdated)}</td>
                  <td className="p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <ActionButton
                        label="View CV"
                        color="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/admin/view-cv/${app.userId}`)}
                      />
                      {app.status === "Applied" && (
                        <ActionButton
                          label="Shortlist"
                          color="bg-yellow-500 hover:bg-yellow-600"
                          onClick={() => updateStatus(app.id, "Shortlisted")}
                        />
                      )}
                      {app.status === "Shortlisted" && (
                        <ActionButton
                          label="Accept"
                          color="bg-green-600 hover:bg-green-700"
                          onClick={() => updateStatus(app.id, "Accepted")}
                        />
                      )}
                      {(app.status === "Applied" || app.status === "Shortlisted") && (
                        <ActionButton
                          label="Reject"
                          color="bg-red-600 hover:bg-red-700"
                          onClick={() => updateStatus(app.id, "Rejected")}
                        />
                      )}
                      <ActionButton
                        label="Delete"
                        color="bg-red-700 hover:bg-red-800"
                        onClick={() => handleDelete(app.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
<div className="md:hidden space-y-4">
  {filtered.map((app) => {
    const actionButtons = [];

    if (app.status === "Applied") {
      actionButtons.push({
        label: "Shortlist",
        color: "bg-yellow-500 hover:bg-yellow-600",
        onClick: () => updateStatus(app.id, "Shortlisted"),
      });
    }

    if (app.status === "Shortlisted") {
      actionButtons.push({
        label: "Accept",
        color: "bg-green-600 hover:bg-green-700",
        onClick: () => updateStatus(app.id, "Accepted"),
      });
    }

    if (app.status === "Applied" || app.status === "Shortlisted") {
      actionButtons.push({
        label: "Reject",
        color: "bg-red-600 hover:bg-red-700",
        onClick: () => updateStatus(app.id, "Rejected"),
      });
    }

    actionButtons.push({
      label: "Delete",
      color: "bg-red-700 hover:bg-red-800",
      onClick: () => handleDelete(app.id),
    });

    const isThreeBottomButtons = actionButtons.length === 3;

    return (
      <div
        key={app.id}
        className="bg-white p-4 rounded-2xl shadow-md hover:bg-green-100 transition"
      >
        {/* TOP SECTION WITH VIEW CV */}
        <div className="flex justify-between items-start">
          <div>
            <p><strong>Application ID:</strong> {app.id}</p>
            <p><strong>Job ID:</strong> {app.jobId}</p>
            <p><strong>Company ID:</strong> {app.companyId}</p>
            <p><strong>User ID:</strong> {app.userId}</p>
            <p><strong>Status:</strong> {app.status}</p>
            <p><strong>Applied:</strong> {formatDate(app.dateApplied)}</p>
            <p><strong>Updated:</strong> {formatDate(app.dateUpdated)}</p>
          </div>

          <ActionButton
            label="View CV"
            color="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate(`/admin/view-cv/${app.userId}`)}
          />
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="mt-4">
          {isThreeBottomButtons ? (
            // 4 total buttons (View CV + 3 bottom)
            <div className="grid grid-cols-3 gap-2">
              {actionButtons.map((btn) => (
                <ActionButton key={btn.label} {...btn} />
              ))}
            </div>
          ) : (
            // Only Delete button (Accepted / Rejected case)
            <div className="flex justify-end">
              {actionButtons.map((btn) => (
                <ActionButton key={btn.label} {...btn} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>

        {/* ================= DELETE MODAL ================= */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
              <h3 className="text-xl font-semibold text-gray-700">Are you sure?</h3>
              <p className="text-gray-500 mt-2">
                You are about to permanently delete this application.
              </p>
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ label, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${color} text-white w-28 h-10 rounded-lg text-sm font-medium`}
    >
      {label}
    </button>
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