import { useParams, useNavigate } from "react-router-dom";

function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function ViewJobPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
  const job = data.jobs.find(j => j.id === id);

  if (!job) return <p className="p-6 text-red-500">Job not found</p>;

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-20">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow overflow-hidden">
        
        {/* Header (FULL WIDTH, NO WHITE BORDER) */}
        <div className="bg-orange-500 text-white px-6 py-5">
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="mt-1 text-orange-100 font-medium">{job.level}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left */}
            <div className="space-y-2">
              <p><span className="font-semibold">Job ID:</span> {job.id}</p>
              <p><span className="font-semibold">Company:</span> {job.companyName}</p>
              <p><span className="font-semibold">Job Title:</span> {job.title}</p>
              <p><span className="font-semibold">Job Level:</span> {job.level}</p>
              <p><span className="font-semibold">Location:</span> {job.location}</p>
            </div>

            {/* Right */}
            <div className="space-y-2">
              <p><span className="font-semibold">Vacancy:</span> {job.vacancy}</p>
              <p><span className="font-semibold">Salary:</span> {job.salary}</p>
              <p><span className="font-semibold">Experience:</span> {job.experience}</p>
              <p><span className="font-semibold">Date Posted:</span> {formatDate(job.datePosted)}</p>
              <p>
                <span className="font-semibold">Deadline:</span>
                <span className="text-red-600 font-semibold ml-1">
                  {formatDate(job.deadline)}
                </span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/company/manage-jobs")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}