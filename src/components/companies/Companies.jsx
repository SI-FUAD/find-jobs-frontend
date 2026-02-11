import JobCard from "../jobs/JobCard";

export default function Companies() {
  const data = JSON.parse(localStorage.getItem("Find Jobs Data")) || { jobs: [], companies: [], others: [] };
  const isLoggedIn = !!data.others.find(o => o.type === "currentUser")?.data;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 p-4 md:p-12 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Companies & Jobs</h1>

      {data.companies.map(company => {
        const companyJobs = data.jobs.filter(j => j.companyId === company.companyId);
        if (!companyJobs.length) return null;

        return (
          <div key={company.companyId} className="space-y-4">
            <h2 className="text-2xl font-semibold" style={{ color: company.brandColor }}>
              {company.brandName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyJobs.map(job => (
                <JobCard key={job.id} job={{ ...job, companyColor: company.brandColor }} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}