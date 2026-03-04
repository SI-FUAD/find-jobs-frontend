import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useRef } from "react";
import { getSimilarTitles } from "../home/jobTitleUtils";

function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

export default function AdminJobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const suggestedRef = useRef(null);

  /* ================= DATA ================= */
  const data = useMemo(() => {
    return (
      JSON.parse(localStorage.getItem("Find Jobs Data")) || {
        jobs: [],
        applications: [],
        users: [],
      }
    );
  }, []);

  const job = data.jobs.find((j) => j.id === jobId);

  /* ================= SUGGESTED CANDIDATES ================= */
  const suggestedCandidates = useMemo(() => {
    if (!job) return [];

    const titleSearch = (job.title || "").toLowerCase();
    if (!titleSearch) return [];

    const similarTitles = getSimilarTitles(titleSearch);

    return (data.users || []).filter((user) => {
      const userTitle = (user.careerTitle || "").toLowerCase();
      return (
        userTitle.includes(titleSearch) ||
        similarTitles.some((sim) =>
          userTitle.includes(sim.toLowerCase())
        )
      );
    });
  }, [data.users, job]);

  /* ================= EARLY RETURN AFTER HOOKS ================= */
  if (!job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-lg">Job not found</p>
      </div>
    );
  }

  /* ================= STATUS CHECK ================= */
  const isExpired =
    new Date(job.deadline) <
    new Date(new Date().toISOString().split("T")[0]);

  /* ================= APPLICATION STATS ================= */
  const jobApplications =
    data.applications?.filter((app) => app.jobId === jobId) || [];

  const totalApplicants = jobApplications.length;
  const totalApplied = jobApplications.filter((a) => a.status === "Applied").length;
  const totalShortlisted = jobApplications.filter((a) => a.status === "Shortlisted").length;
  const totalAccepted = jobApplications.filter((a) => a.status === "Accepted").length;
  const totalRejected = jobApplications.filter((a) => a.status === "Rejected").length;

  /* ================= DELETE HANDLER ================= */
  const handleDeleteConfirm = () => {
    const updatedJobs = data.jobs.filter((j) => j.id !== jobId);
    const updatedApplications = data.applications.filter((a) => a.jobId !== jobId);

    localStorage.setItem(
      "Find Jobs Data",
      JSON.stringify({
        ...data,
        jobs: updatedJobs,
        applications: updatedApplications,
      })
    );

    navigate("/admin/manage-jobs");
  };

  /* ================= TOGGLE SUGGESTED WITH SMOOTH SCROLL ================= */
  const handleToggleSuggested = () => {
    if (!showSuggested) {
      setShowSuggested(true);

      // Wait for render before scrolling
      setTimeout(() => {
        suggestedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      setShowSuggested(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-green-50 min-h-screen rounded-t-3xl pt-24 px-4 pb-10">
        <div className="max-w-5xl mx-auto">

          {/* ================= ACTION BAR ================= */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="border border-green-600 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition"
            >
              ← Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleToggleSuggested}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
              >
                {showSuggested
                  ? "Hide Suggested Candidates"
                  : "Show Suggested Candidates"}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Delete Job
              </button>
            </div>
          </div>

          {/* ================= JOB DETAILS CARD ================= */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-green-500 text-white px-6 py-6">
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <p className="mt-1 text-green-100 font-medium">{job.level}</p>

              <div className="mt-3">
                <span
                  className={`px-6 py-2 rounded-2xl text-lg font-semibold ${
                    isExpired ? "bg-red-600 text-white" : "bg-green-700 text-white"
                  }`}
                >
                  {isExpired ? "Expired" : "Active"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <StatCard title="Total Applicants" value={totalApplicants} />
                <StatCard title="Applied" value={totalApplied} />
                <StatCard title="Shortlisted" value={totalShortlisted} />
                <StatCard title="Accepted" value={totalAccepted} />
                <StatCard title="Rejected" value={totalRejected} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Detail label="Job ID" value={job.id} />
                  <Detail label="Title" value={job.title} />
                  <Detail label="Level" value={job.level} />
                  <Detail label="Company" value={job.companyName} />
                  <Detail label="Company ID" value={job.companyId} />
                  <Detail label="Location" value={job.location} />
                </div>

                <div className="space-y-3">
                  <Detail label="Vacancy" value={job.vacancy} />
                  <Detail label="Salary" value={job.salary} />
                  <Detail label="Experience" value={job.experience} />
                  <Detail label="Date Posted" value={formatDate(job.datePosted)} />
                  <Detail
                    label="Deadline"
                    value={
                      <span className="text-red-600 font-semibold">
                        {formatDate(job.deadline)}
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </div>
          </div>

          {/* ================= SUGGESTED CARD ================= */}
          {showSuggested && (
            <div
              ref={suggestedRef}
              className="bg-white rounded-2xl shadow-md overflow-hidden mt-10"
            >
              <div className="bg-green-500 text-white px-6 py-6">
                <h3 className="text-2xl font-bold">Suggested Candidates</h3>
                <p className="text-green-100 mt-1">
                  Users with similar career titles to this job are suggested here
                  to help you quickly identify relevant candidates.
                </p>
              </div>

              <div className="p-6">
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="p-3">User ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Profile Completion</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {suggestedCandidates.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-gray-500">
                            No matching candidates found
                          </td>
                        </tr>
                      ) : (
                        suggestedCandidates.map((user) => (
                          <tr
                            key={user.userId}
                            className="border-t hover:bg-green-50 transition"
                          >
                            <td className="p-3 font-mono">{user.userId}</td>
                            <td className="p-3 font-medium">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="p-3">{user.careerTitle || "-"}</td>
                            <td className="p-3">
                              {user.profileCompletion || 0}%
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() =>
                                  navigate(`/admin/view-cv/${user.userId}`)
                                }
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                              >
                                View CV
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {suggestedCandidates.map((user) => (
                    <div
                      key={user.userId}
                      className="bg-white rounded-2xl p-4 shadow-md hover:bg-green-100 transition"
                    >
                      <div className="text-sm font-mono text-gray-500">
                        <b>User ID:</b> {user.userId}
                      </div>

                      <h2 className="text-xl font-semibold mt-1">
                        {user.firstName} {user.lastName}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        <b>Title:</b> {user.careerTitle || "-"}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        <b>Profile Completion:</b>{" "}
                        {user.profileCompletion || 0}%
                      </p>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            navigate(`/admin/view-cv/${user.userId}`)
                          }
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
                        >
                          View CV
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-700">
              Confirm Delete
            </h3>
            <p className="text-gray-500 mt-2">
              Are you sure you want to permanently delete this job?
              <br />
              All applications submitted for this job will also be deleted.
            </p>
            <div className="mt-4 flex gap-4">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value }) {
  return (
    <div className="bg-green-100 rounded-xl p-4 text-center shadow-sm">
      <p className="text-sm text-green-700 font-medium">{title}</p>
      <p className="text-2xl font-bold text-green-800 mt-1">{value}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p>
      <span className="font-semibold">{label}:</span> {value || "-"}
    </p>
  );
}