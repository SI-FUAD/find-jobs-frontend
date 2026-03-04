import { useMemo, useState } from "react";

export default function CompanyDashboard() {
  const storedData = JSON.parse(localStorage.getItem("Find Jobs Data")) || {
    jobs: [],
    applications: [],
    others: [],
    companies: [],
    users: []
  };

  const currentUser = storedData.others.find(
    o => o.type === "currentUser"
  )?.data;

  const today = new Date().toISOString().split("T")[0];

  // ================= JOB DATA =================

  const companyJobs = useMemo(() => {
    if (!currentUser?.companyId) return [];
    return storedData.jobs.filter(
      job => job.companyId === currentUser.companyId
    );
  }, [storedData.jobs, currentUser?.companyId]);

  const activeJobs = companyJobs.filter(j => j.deadline >= today);
  const expiredJobs = companyJobs.filter(j => j.deadline < today);

  // ================= APPLICATION DATA =================

  const companyApplications = useMemo(() => {
    return storedData.applications.filter(app =>
      companyJobs.some(job => job.id === app.jobId) &&
      (app.status === "Shortlisted" ||
        app.status === "Accepted" ||
        app.status === "Rejected")
    );
  }, [storedData.applications, companyJobs]);

  const shortlisted = companyApplications.filter(a => a.status === "Shortlisted");
  const accepted = companyApplications.filter(a => a.status === "Accepted");
  const rejected = companyApplications.filter(a => a.status === "Rejected");

  const totalCandidates =
    shortlisted.length + accepted.length + rejected.length;

  // ================= PERFORMANCE DATA =================

  const recentJobs = [...companyJobs]
    .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
    .slice(0, 3);

  const recentUpdatedApplications = [...companyApplications]
    .filter(a => a.dateUpdated)
    .sort((a, b) => new Date(b.dateUpdated) - new Date(a.dateUpdated))
    .slice(0, 3);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ================= PASSWORD =================

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "" });
  const [modal, setModal] = useState({ show: false, type: "success", message: "" });

  if (!currentUser?.companyId) {
    return <p className="p-6 text-red-500">Unauthorized</p>;
  }

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.new) {
      setModal({ show: true, type: "error", message: "Please fill both fields" });
      return;
    }

    if (passwordForm.current !== currentUser.password) {
      setModal({ show: true, type: "error", message: "Current password does not match" });
      return;
    }

    const updatedCompanies = storedData.companies.map(c =>
      c.companyId === currentUser.companyId
        ? { ...c, password: passwordForm.new }
        : c
    );

    const updatedOthers = storedData.others.map(o =>
      o.type === "currentUser"
        ? { ...o, data: { ...o.data, password: passwordForm.new } }
        : o
    );

    localStorage.setItem(
      "Find Jobs Data",
      JSON.stringify({
        ...storedData,
        companies: updatedCompanies,
        others: updatedOthers
      })
    );

    setModal({ show: true, type: "success", message: "Password updated successfully!" });
    setPasswordForm({ current: "", new: "" });
    setShowPasswordForm(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-8">

      {/* ===== Welcome ===== */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome,{" "}
          <span className="text-orange-500">{currentUser.brandName}</span>
        </h1>
        <p className="text-gray-500 mt-1">Company performance overview</p>
      </div>

      {/* ===== COMPANY INFORMATION ===== */}
<div className="bg-white rounded-2xl p-6 shadow-md">
  <h2 className="text-xl font-bold mb-5 text-gray-800">
    Company Information
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base">

    <InfoRow label="Company ID" value={currentUser.companyId} mono />
    <InfoRow label="Company Name" value={currentUser.brandName} />

    <InfoRow
      label="Email"
      value={currentUser.email}
      className="md:col-start-2 md:row-start-1"
    />

    <InfoRow
      label="Phone"
      value={currentUser.phone}
      className="md:col-start-2 md:row-start-2"
    />

    <InfoRow
      label="Address"
      value={currentUser.address}
      full
    />

  </div>
</div>

      {/* ===== JOB INSIGHTS ===== */}
      <div>
        <h2 className="text-xl font-bold mb-4">Job Insights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard title="Total Jobs" value={companyJobs.length} />
          <StatCard title="Active Jobs" value={activeJobs.length} accent="text-green-600" />
          <StatCard title="Expired Jobs" value={expiredJobs.length} accent="text-red-600" />
        </div>
      </div>

      {/* ===== CANDIDATE INSIGHTS ===== */}
      <div>
        <h2 className="text-xl font-bold mb-4">Candidate Insights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard title="Total Candidates" value={totalCandidates} accent="text-orange-600" />
          <StatCard title="Shortlisted" value={shortlisted.length} accent="text-yellow-600" />
          <StatCard title="Accepted" value={accepted.length} accent="text-green-600" />
          <StatCard title="Rejected" value={rejected.length} accent="text-red-600" />
        </div>
      </div>

      {/* ================= PERFORMANCE OVERVIEW ================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">Performance Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <DataCard title="Recent Job Posts">
            {recentJobs.map(job => (
              <Row
                key={job.id}
                left={`${job.id} - ${job.title}`}
                right={formatDate(job.datePosted)}
              />
            ))}
          </DataCard>

          <DataCard title="Recently Updated Candidates">
            {recentUpdatedApplications.map(app => {
              const user = storedData.users.find(
                u => u.userId === app.userId
              );

              const fullName = user
                ? `${user.firstName} ${user.lastName}`
                : "Unknown User";

              return (
                <Row
                  key={app.id}
                  left={`${app.jobId} - ${fullName}`}
                  right={app.status}
                />
              );
            })}
          </DataCard>

        </div>
      </div>

      {/* ===== PASSWORD CHANGE ===== */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-md space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          Security Settings
        </h2>

        <button
          onClick={() => setShowPasswordForm(prev => !prev)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
        >
          {showPasswordForm ? "Cancel Password Change" : "Change Password"}
        </button>

        {showPasswordForm && (
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordForm.current}
              onChange={e => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.new}
              onChange={e => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
              className="w-full border rounded-lg p-2"
            />
            <button
              onClick={handlePasswordChange}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
            >
              Save Password
            </button>
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center space-y-4">
            <h3 className={`text-lg font-semibold ${modal.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {modal.type === "success" ? "Success" : "Error"}
            </h3>
            <p>{modal.message}</p>
            <button
              onClick={() => setModal(prev => ({ ...prev, show: false }))}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/* ===== REUSABLE COMPONENTS ===== */

function StatCard({ title, value, accent = "text-orange-600" }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md 
                    h-32 flex flex-col justify-center items-center">
      <p className="text-sm text-gray-500 mb-2 text-center">
        {title}
      </p>
      <p className={`text-3xl font-bold ${accent}`}>
        {value}
      </p>
    </div>
  );
}

function DataCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Row({ left, right }) {
  return (
    <div className="flex justify-between items-center">
      <span className="truncate">{left}</span>
      <span className="font-semibold text-orange-600">{right}</span>
    </div>
  );
}

function InfoRow({ label, value, mono = false, full = false, className = "" }) {
  return (
    <div className={`${full ? "md:col-span-2" : ""} ${className}`}>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p
        className={`font-medium text-gray-800 break-words ${
          mono ? "font-mono text-sm" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}