import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyCandidates() {
  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem("Find Jobs Data")) || {
    users: [],
    companies: [],
    jobs: [],
    applications: [],
    others: [],
  };

  const currentUser = storedData.others.find(
    (o) => o.type === "currentUser"
  )?.data;

  const companyJobs = useMemo(() => {
    if (!currentUser?.companyId) return [];
    return storedData.jobs.filter(
      (job) => job.companyId === currentUser.companyId
    );
  }, [storedData.jobs, currentUser?.companyId]);

  const companyApplications = useMemo(() => {
    return (
      storedData.applications?.filter(
        (app) =>
          app.status === "Shortlisted" ||
          app.status === "Accepted" ||
          app.status === "Rejected"
      ) || []
    );
  }, [storedData.applications]);

  if (!currentUser?.companyId) {
    return <p className="p-6 text-red-500">Unauthorized</p>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Candidates
      </h1>

      {/* Updated Instruction */}
      <div className="bg-orange-100 border-l-4 border-orange-600 p-4 rounded-xl mb-8">
        <p className="text-gray-800">
          We will shortlist one or more candidates for your job posts.
          Please check their CV carefully and let us know your interest,
          or you can share your interest when contacted.
        </p>
      </div>

      {companyJobs.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            You have not posted any jobs yet.
          </p>
        </div>
      )}

      {companyJobs.map((job) => {
        const jobCandidates = companyApplications.filter(
          (app) => app.jobId === job.id
        );

        return (
          <div key={job.id} className="mb-10">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-500 font-mono">
                Job ID: {job.id}
              </p>
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-gray-50 rounded-xl shadow overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-orange-200">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Applied On</th>
                    <th className="p-3">Updated On</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">CV</th>
                  </tr>
                </thead>
                <tbody>
                  {jobCandidates.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="p-6 text-center text-gray-600"
                      >
                        No shortlisted candidates yet.
                      </td>
                    </tr>
                  ) : (
                    jobCandidates.map((app) => {
                      const user = storedData.users.find(
                        (u) => u.userId === app.userId
                      );

                      const statusColor =
                        app.status === "Accepted"
                          ? "bg-green-200 text-green-800"
                          : app.status === "Rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800";

                      return (
                        <tr
                          key={app.id}
                          className="border-t hover:bg-gray-200 transition"
                        >
                          <td className="p-3">{user?.userId || "-"}</td>
                          <td className="p-3 font-medium">
                            {user
                              ? `${user.firstName} ${user.lastName}`
                              : "-"}
                          </td>
                          <td className="p-3">{user?.email || "-"}</td>
                          <td className="p-3">{user?.phone || "-"}</td>
                          <td className="p-3">
                            {app.dateApplied
                              ? new Date(app.dateApplied).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="p-3">
                            {app.dateUpdated
                              ? new Date(app.dateUpdated).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button onClick={() => navigate(`/company/view-cv/${user.userId}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                            >
                              View CV
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden space-y-4">
              {jobCandidates.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-xl shadow text-center text-gray-600">
                  No shortlisted candidates yet.
                </div>
              ) : (
                jobCandidates.map((app) => {
                  const user = storedData.users.find(
                    (u) => u.userId === app.userId
                  );

                  const statusColor =
                    app.status === "Accepted"
                      ? "bg-green-200 text-green-800"
                      : app.status === "Rejected"
                      ? "bg-red-200 text-red-800"
                      : "bg-yellow-200 text-yellow-800";

                  return (
                    <div
                      key={app.id}
                      className="bg-gray-50 rounded-xl shadow p-4 hover:bg-gray-200 transition"
                    >
                      <p><strong>User ID:</strong> {user?.userId || "-"}</p>
                      <p><strong>Name:</strong> {user ? `${user.firstName} ${user.lastName}` : "-"}</p>
                      <p><strong>Email:</strong> {user?.email || "-"}</p>
                      <p><strong>Phone:</strong> {user?.phone || "-"}</p>
                      <p>
                        <strong>Applied:</strong>{" "}
                        {app.dateApplied
                          ? new Date(app.dateApplied).toLocaleDateString()
                          : "-"}
                      </p>
                      <p>
                        <strong>Updated:</strong>{" "}
                        {app.dateUpdated
                          ? new Date(app.dateUpdated).toLocaleDateString()
                          : "-"}
                      </p>

                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                      >
                        {app.status}
                      </span>

                      <button onClick={() => navigate(`/company/view-cv/${user.userId}`)}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition"
                      >
                        View CV
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}