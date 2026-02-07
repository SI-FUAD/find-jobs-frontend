import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

function DeleteModal({ job, onClose, onConfirm }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
        <h2 className="text-xl font-bold">Delete Job</h2>
        <p className="mt-2">
          Are you sure you want to delete <b>{job.title}</b>?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function ManageJobPosts() {
  const navigate = useNavigate();

  // ✅ Always read data first
  const storedData = JSON.parse(localStorage.getItem("Find Jobs Data")) || {
    jobs: [],
    others: []
  };

  const currentUser = storedData.others.find(
    o => o.type === "currentUser"
  )?.data;

  // ✅ Hooks MUST be unconditional
  const jobs = useMemo(() => {
    if (!currentUser?.companyId) return [];
    return storedData.jobs.filter(
      j => j.companyId === currentUser.companyId
    );
  }, [storedData.jobs, currentUser?.companyId]);

  const [deleteJob, setDeleteJob] = useState(null);

  const isExpired = deadline =>
    new Date(deadline) <
    new Date(new Date().toISOString().split("T")[0]);

  const handleDelete = () => {
    const updatedData = {
      ...storedData,
      jobs: storedData.jobs.filter(j => j.id !== deleteJob.id)
    };

    localStorage.setItem("Find Jobs Data", JSON.stringify(updatedData));
    setDeleteJob(null);
  };

  // ✅ Conditional rendering AFTER hooks
  if (!currentUser?.companyId) {
    return <p className="p-6 text-red-500">Unauthorized</p>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* ✅ Larger on mobile */}
        <h1 className="text-2xl md:text-3xl font-bold">
          Manage Job Posts
        </h1>

        <button
          onClick={() => navigate("/company/add-job")}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold text-sm md:text-base"
        >
          + Add A New Job Post
        </button>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-orange-100">
            <tr>
              <th className="p-3">Job ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Location</th>
              <th className="p-3">Vacancy</th>
              <th className="p-3">Posted</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map(job => {
              const expired = isExpired(job.deadline);

              return (
                <tr
                  key={job.id}
                  className={`border-t transition ${
                    expired
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-white hover:bg-gray-200"
                  }`}
                >
                  <td className="p-3 font-mono text-sm">{job.id}</td>
                  <td className="p-3 font-medium">{job.title}</td>
                  <td className="p-3">{job.location}</td>
                  <td className="p-3">{job.vacancy}</td>
                  <td className="p-3">{formatDate(job.datePosted)}</td>
                  <td className="p-3 text-red-600 font-semibold">{formatDate(job.deadline)}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/company/view-job/${job.id}`)
                      }
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/company/edit-job/${job.id}`)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteJob(job)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-4">
        {jobs.map(job => {
          const expired = isExpired(job.deadline);

          return (
            <div
              key={job.id}
              className={`rounded-xl p-4 shadow transition ${
                expired
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              <div className="text-sm text-gray-500 font-mono">
                {job.id}
              </div>

              <h2 className="text-xl font-semibold mt-1">
                {job.title}
              </h2>

              <p className="text-gray-600">{job.location}</p>

              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <p><b>Vacancy:</b> {job.vacancy}</p>
                <p><b>Posted:</b> {formatDate(job.datePosted)}</p>
                <p className="col-span-2 text-red-600 font-semibold">
                  Deadline: {formatDate(job.deadline)}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigate(`/company/view-job/${job.id}`)
                  }
                  className="flex-1 bg-gray-600 text-white py-1.5 rounded-lg text-sm"
                >
                  View
                </button>
                <button
                  onClick={() =>
                    navigate(`/company/edit-job/${job.id}`)
                  }
                  className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteJob(job)}
                  className="flex-1 bg-red-600 text-white py-1.5 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {deleteJob && (
        <DeleteModal
          job={deleteJob}
          onClose={() => setDeleteJob(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}