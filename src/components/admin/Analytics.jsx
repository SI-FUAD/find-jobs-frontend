import { useState, useMemo } from "react";
import usePageTitle from "../home/usePageTitle";
import { generateFakeData } from "./fakeDataGenerator";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Analytics() {
  usePageTitle("Admin Dashboard");
  const [showModal, setShowModal] = useState(false);
  const [actionModal, setActionModal] = useState({ show: false, message: "" });
  const [showImportModal, setShowImportModal] = useState(false);

  /* ================= DATA ================= */

  const [data, setData] = useState(() => {
  return JSON.parse(localStorage.getItem("Find Jobs Data")) || {
    users: [],
    companies: [],
    jobs: [],
    applications: [],
    others: [],
  };
});

// Function to refresh data after changes
const refreshData = () => {
  const newData = JSON.parse(localStorage.getItem("Find Jobs Data")) || {
    users: [],
    companies: [],
    jobs: [],
    applications: [],
    others: [],
  };
  setData(newData);
};

  const { users, companies, jobs, applications } = data;

  /* ================= BASIC COUNTS ================= */

  const totalUsers = users.length;
  const totalCompanies = companies.length;
  const totalJobs = jobs.length;
  const totalApplications = applications.length;

  /* ================= USERS ================= */

  const uniqueAppliedUsers =
    new Set(applications.map((a) => a.userId)).size;

  const avgProfileCompletion = totalUsers
    ? Math.round(
        users.reduce(
          (sum, u) => sum + (u.profileCompletion || 0),
          0
        ) / totalUsers
      )
    : 0;

  const completedProfiles = users.filter(
    (u) => u.profileCompletion === 100
  ).length;

  const uncompletedProfiles = users.filter(
    (u) => (u.profileCompletion || 0) < 100
  ).length;

  /* ================= JOBS ================= */

  const expiredJobs = jobs.filter(
    (job) => new Date(job.deadline) < new Date()
  ).length;

  const activeJobs = totalJobs - expiredJobs;

  const avgApplicationsPerJob = totalJobs
    ? (totalApplications / totalJobs).toFixed(1)
    : 0;

  /* ================= APPLICATION STATUS ================= */

  const applied = applications.filter(
    (a) => a.status === "Applied"
  ).length;

  const shortlisted = applications.filter(
    (a) => a.status === "Shortlisted"
  ).length;

  const accepted = applications.filter(
    (a) => a.status === "Accepted"
  ).length;

  const rejected = applications.filter(
    (a) => a.status === "Rejected"
  ).length;

  const pending = applied + shortlisted;
  const completedApplications = accepted + rejected;

  const acceptanceRate = totalApplications
    ? Math.round((accepted / totalApplications) * 100)
    : 0;

  const rejectionRate = totalApplications
    ? Math.round((rejected / totalApplications) * 100)
    : 0;

  const updatedApplications = applications.filter(
    (a) => a.dateUpdated
  ).length;

  /* ================= PIE DATA ================= */

  const pieData = [
    { name: "Applied", value: applied },
    { name: "Shortlisted", value: shortlisted },
    { name: "Accepted", value: accepted },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#2563eb", "#f59e0b", "#16a34a", "#dc2626"];

  /* ================= PERFORMANCE ================= */

  const topUsers = useMemo(() => {
  const map = {};

  applications
    .filter((a) => a.status === "Accepted")
    .forEach((a) => {
      map[a.userId] = (map[a.userId] || 0) + 1;
    });

  return Object.entries(map)
    .map(([userId, value]) => {
      const user = users.find((u) => u.userId === userId);

      return {
        userId,
        fullName: user
          ? `${user.firstName} ${user.lastName}`
          : "Unknown User",
        value,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}, [applications, users]);

  const topCompanies = useMemo(() => {
  const map = {};

  applications.forEach((a) => {
    const job = jobs.find((j) => j.id === a.jobId);
    if (!job) return;

    map[job.companyId] = (map[job.companyId] || 0) + 1;
  });

  return Object.entries(map)
    .map(([companyId, value]) => {
      const company = companies.find(
        (c) => c.companyId === companyId
      );

      return {
        companyId,
        brandName: company
          ? company.brandName
          : "Unknown Company",
        value,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}, [applications, companies, jobs]);

  const topJobs = useMemo(() => {
  const map = {};

  applications.forEach((a) => {
    map[a.jobId] = (map[a.jobId] || 0) + 1;
  });

  return Object.entries(map)
    .map(([jobId, value]) => {
      const job = jobs.find((j) => j.id === jobId);

      return {
        jobId,
        title: job ? job.title : "Unknown Job",
        value,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}, [applications, jobs]);

const recentUpdatedApplications = useMemo(() => {
  return applications
    .filter((a) => a.dateUpdated)
    .sort(
      (a, b) =>
        new Date(b.dateUpdated) - new Date(a.dateUpdated)
    )
    .slice(0, 5)
    .map((app) => {
      const user = users.find(
        (u) => u.userId === app.userId
      );

      return {
        id: app.id,
        status: app.status,
        fullName: user
          ? `${user.firstName} ${user.lastName}`
          : "Unknown User",
      };
    });
}, [applications, users]);

  /* ================= ADMIN ACTIONS ================= */

  const handleImportFakeData = () => {
  const existingData = JSON.parse(localStorage.getItem("Find Jobs Data")) || {};
  const fakeData = generateFakeData();

  const newData = {
    ...existingData,
    users: fakeData.users,
    companies: fakeData.companies,
    jobs: fakeData.jobs,
    applications: fakeData.applications,
  };

  localStorage.setItem("Find Jobs Data", JSON.stringify(newData));

  refreshData(); // <-- refresh page data immediately

  setActionModal({ show: true, message: "Fake data imported successfully!" });
};

const handleClearAll = () => {
  const existingData = JSON.parse(localStorage.getItem("Find Jobs Data")) || {};

  const newData = {
    ...existingData,
    users: [],
    companies: [],
    jobs: [],
    applications: [],
  };

  localStorage.setItem("Find Jobs Data", JSON.stringify(newData));

  refreshData(); // <-- refresh page data immediately
  setShowModal(false);

  setActionModal({
    show: true,
    message:
      "All users, companies, jobs, and applications have been cleared.\nAdmin is still logged in.",
  });
};

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-green-50 min-h-screen rounded-t-3xl p-4 md:p-6">

        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Admin Analytics
        </h1>

        {/* ================= USER INSIGHTS ================= */}
        <SectionTitle title="User Insights" />
        <Grid>
          <StatCard title="Total Users" value={totalUsers} />
          <StatCard title="Users Who Applied" value={uniqueAppliedUsers} />
          <StatCard title="Avg Profile Completion" value={`${avgProfileCompletion}%`} />
          <StatCard title="Completed Profiles (100%)" value={completedProfiles} />
          <StatCard title="Uncompleted Profiles" value={uncompletedProfiles} />
        </Grid>

        {/* ================= COMPANY INSIGHTS ================= */}
        <SectionTitle title="Company Insights" />
        <Grid>
          <StatCard title="Total Companies" value={totalCompanies} />
          <StatCard
            title="Avg Jobs per Company"
            value={
              totalCompanies
                ? (totalJobs / totalCompanies).toFixed(1)
                : 0
            }
          />
        </Grid>

        {/* ================= JOB INSIGHTS ================= */}
        <SectionTitle title="Job Insights" />
        <Grid>
          <StatCard title="Total Jobs" value={totalJobs} />
          <StatCard title="Active Jobs" value={activeJobs} />
          <StatCard title="Expired Jobs" value={expiredJobs} />
          <StatCard
            title="Avg Applications per Job"
            value={avgApplicationsPerJob}
          />
        </Grid>

        {/* ================= APPLICATION INSIGHTS ================= */}
        <SectionTitle title="Application Insights" />
        <Grid>
          <StatCard title="Total Applications" value={totalApplications} />
          <StatCard title="Applied" value={applied} />
          <StatCard title="Shortlisted" value={shortlisted} />
          <StatCard title="Accepted" value={accepted} />
          <StatCard title="Rejected" value={rejected} />
          <StatCard title="Pending" value={pending} />
          <StatCard title="Completed" value={completedApplications} />
          <StatCard title="Acceptance Rate" value={`${acceptanceRate}%`} />
          <StatCard title="Rejection Rate" value={`${rejectionRate}%`} />
          <StatCard title="Applications Updated" value={updatedApplications} />
        </Grid>

        {/* ================= PIE CHART ================= */}
        <div className="bg-white rounded-2xl shadow-md p-6 my-10">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ================= PERFORMANCE OVERVIEW ================= */}
        <SectionTitle title="Performance Overview" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <DataCard title="Top Users (Accepted)">
  {topUsers.map((u) => (
    <Row
      key={u.userId}
      left={`${u.userId} - ${u.fullName}`}
      right={u.value}
    />
  ))}
</DataCard>

          <DataCard title="Top Companies (Applications)">
  {topCompanies.map((c) => (
    <Row
      key={c.companyId}
      left={`${c.companyId} - ${c.brandName}`}
      right={c.value}
    />
  ))}
</DataCard>

          <DataCard title="Top Jobs (Applications)">
  {topJobs.map((j) => (
    <Row
      key={j.jobId}
      left={`${j.jobId} - ${j.title}`}
      right={j.value}
    />
  ))}
</DataCard>

          <DataCard title="Recently Updated Applications">
  {recentUpdatedApplications.map((a) => (
    <Row
      key={a.id}
      left={`${a.id} - ${a.fullName}`}
      right={a.status}
    />
  ))}
</DataCard>

        </div>

        {/* ================= SYSTEM MANAGEMENT ================= */}

        <div className="bg-white rounded-2xl p-6 shadow-md mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Import fake data to test the full project?
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Populate the system instantly with demo users, companies, jobs and applications.
            You can also permanently remove everything using the clear button.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
  onClick={() => setShowImportModal(true)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition w-full sm:w-auto"
>
  Import Fake Data
</button>

            <button
  onClick={() => setShowModal(true)}
  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition w-full sm:w-auto"
>
  Clear All Data
</button>
          </div>
        </div>

      </div>
      {showImportModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        Confirm Import Fake Data
      </h2>
      <p className="mb-6 text-gray-600">
        This will overwrite all users, companies, jobs, and applications with fake data.
        <br /><br />
        Your admin account and other settings will remain intact.
        <br /><br />
        Are you sure you want to continue?
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowImportModal(false)}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleImportFakeData();
            setShowImportModal(false);
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
      {/* 🔴 Confirmation Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        Confirm Clear All Data
      </h2>

      <p className="mb-6 text-gray-600">
  This will permanently delete ALL Find Jobs data from your browser,
  including users, companies, jobs, and applications.
  <br /><br />
  Admin will remain logged in.
  <br /><br />
  Are you sure you want to continue?
</p>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={handleClearAll}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
{/* 🔵 Action Success Modal */}
{actionModal.show && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Message</h2>
      <p className="mb-6 text-gray-600 whitespace-pre-line">{actionModal.message}</p>
      <div className="flex justify-end">
        <button
          onClick={() => setActionModal({ show: false, message: "" })}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-green-700">{value}</p>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h2 className="text-xl font-semibold text-green-700 mb-4">
      {title}
    </h2>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {children}
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
    <div className="flex justify-between">
      <span>{left}</span>
      <span className="text-green-700 font-semibold">{right}</span>
    </div>
  );
}

export default Analytics;