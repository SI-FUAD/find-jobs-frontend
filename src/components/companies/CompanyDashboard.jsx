import { useMemo } from "react";

export default function CompanyDashboard() {
  const storedData = JSON.parse(localStorage.getItem("Find Jobs Data")) || {
    jobs: [],
    others: [],
  };

  const currentUser = storedData.others.find(
    o => o.type === "currentUser"
  )?.data;

  const today = new Date().toISOString().split("T")[0];

  // ✅ Hooks are ALWAYS called
  const companyJobs = useMemo(() => {
    if (!currentUser?.companyId) return [];
    return storedData.jobs.filter(
      job => job.companyId === currentUser.companyId
    );
  }, [storedData.jobs, currentUser?.companyId]);

  const activeJobs = companyJobs.filter(j => j.deadline >= today);
  const expiredJobs = companyJobs.filter(j => j.deadline < today);

  // ✅ Conditional rendering AFTER hooks
  if (!currentUser?.companyId) {
    return <p className="p-6 text-red-500">Unauthorized</p>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ===== Welcome ===== */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome,{" "}
          <span className="text-orange-500">
            {currentUser.brandName}
          </span>
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s an overview of your company activity
        </p>
      </div>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Job Posts" value={companyJobs.length} />
        <StatCard
          title="Active Job Posts"
          value={activeJobs.length}
          accent="text-green-600"
        />
        <StatCard
          title="Expired Job Posts"
          value={expiredJobs.length}
          accent="text-red-600"
        />
      </div>

      {/* ===== Company Info ===== */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Company Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
          {/* Mobile order: ID → Name → Email → Phone */}
          {/* Desktop: Left (ID, Name) | Right (Email, Phone) */}

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

          {/* Full width */}
          <InfoRow
            label="Address"
            value={currentUser.address}
            full
          />
        </div>
      </div>
    </div>
  );
}

/* ===== Components ===== */

function StatCard({ title, value, accent = "text-orange-600" }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function InfoRow({ label, value, mono = false, full = false, className = "" }) {
  return (
    <div className={`${full ? "md:col-span-2" : ""} ${className}`}>
      <p className="text-gray-500 text-sm">{label}</p>
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