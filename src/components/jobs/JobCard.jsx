import { FaUsers, FaBriefcase, FaMoneyBillAlt, FaCalendarAlt } from "react-icons/fa";

export default function JobCard({ job, isLoggedIn }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition duration-300 space-y-3">
      {/* Company Name Button */}
      <button
        className="px-3 py-1 rounded-full text-white font-semibold text-sm"
        style={{ backgroundColor: job.companyColor || "#F97316" }}
      >
        {job.companyName}
      </button>

      {/* Job Title */}
      <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>

      {/* Description */}
      <p className="text-gray-600 text-sm md:text-base line-clamp-3">
        {job.description}
      </p>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 text-sm mt-2">
        <p className="flex items-center gap-1"><FaUsers /> Vacancy: {job.vacancy}</p>
        <p className="flex items-center gap-1"><FaBriefcase /> Experience: {job.experience}</p>
        <p className="flex items-center gap-1"><FaMoneyBillAlt /> Salary: {job.salary || "Negotiable"}</p>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mt-2">
        <p className="flex items-center gap-1"><FaCalendarAlt /> Posted: {formatDate(job.datePosted)}</p>
        <p className="flex items-center gap-1 text-red-600"><FaCalendarAlt /> Deadline: {formatDate(job.deadline)}</p>
      </div>

      {/* Buttons for logged in users */}
      {isLoggedIn && (
        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition">
            Save Job
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
            Apply
          </button>
        </div>
      )}
    </div>
  );
}