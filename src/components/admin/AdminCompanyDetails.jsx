import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function AdminCompanyDetails() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const storedData = JSON.parse(localStorage.getItem("Find Jobs Data")) || {
    companies: [],
    jobs: [],
  };

  const company = storedData.companies.find(
    (c) => c.companyId === companyId
  );

  const today = new Date().toISOString().split("T")[0];

  const companyJobs = useMemo(() => {
    if (!companyId) return [];
    return storedData.jobs.filter(
      (job) => job.companyId === companyId
    );
  }, [storedData.jobs, companyId]);

  const activeJobs = companyJobs.filter((j) => j.deadline >= today);
  const expiredJobs = companyJobs.filter((j) => j.deadline < today);

  if (!company) {
    return <p className="p-6 text-red-500">Company not found</p>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-orange-50 min-h-screen rounded-t-3xl pt-24 px-4 pb-10">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Back Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="border border-orange-600 text-orange-700 px-4 py-2 rounded-lg font-medium hover:bg-orange-100 transition"
            >
              ← Back
            </button>
          </div>

          {/* ===== Stats Section ===== */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              title="Total Job Posts"
              value={companyJobs.length}
            />
            <StatCard
              title="Active Jobs"
              value={activeJobs.length}
              accent="text-green-600"
            />
            <StatCard
              title="Expired Jobs"
              value={expiredJobs.length}
              accent="text-red-600"
            />
          </div>

          {/* ===== Company Info ===== */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Company Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InfoRow
                label="Company ID"
                value={company.companyId}
                mono
              />

              <InfoRow
                label="Company Name"
                value={company.brandName}
              />

              <InfoRow
                label="Email"
                value={company.email}
              />

              <InfoRow
                label="Phone"
                value={company.phone}
              />

              <InfoRow
                label="Address"
                value={company.address}
                full
              />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ===== Components ===== */

function StatCard({ title, value, accent = "text-orange-600" }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-3xl font-bold ${accent}`}>
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value, mono = false, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
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