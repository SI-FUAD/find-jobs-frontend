import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "./JobCard";
import { getSimilarTitles } from "../home/jobTitleUtils";

export default function Jobs() {
  const [searchParams] = useSearchParams();

  // Filters
  const [search, setSearch] = useState(searchParams.get("title") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const [levelFilter, setLevelFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState(""); // in years (number)
  const [salaryFilter, setSalaryFilter] = useState([0, 100000]); // min-max

  const [data, setData] = useState(() => JSON.parse(localStorage.getItem("Find Jobs Data")) || { jobs: [], others: [] });
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("Find Jobs Data")) || { others: [] };
    return stored.others?.find((o) => o.type === "currentUser")?.data || null;
  });

  // Compute salary min/max for slider
  const salaryMin = Math.min(...data.jobs.map(j => parseInt(j.salary)));
  const salaryMax = Math.max(...data.jobs.map(j => parseInt(j.salary)));

  useEffect(() => {
    const handleAuthChange = () => {
      const updatedData = JSON.parse(localStorage.getItem("Find Jobs Data")) || { jobs: [], others: [] };
      setData(updatedData);
      const user = updatedData.others?.find((o) => o.type === "currentUser")?.data || null;
      setCurrentUser(user);
    };

    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  // Parse experience string into min/max years
  const parseExperience = (exp) => {
    if (!exp) return { min: 0, max: Infinity };
    const text = exp.toLowerCase().trim();
    if (text.includes("fresher")) return { min: 0, max: 0 };
    if (text.includes("+")) {
      const num = parseInt(text);
      return { min: num, max: Infinity };
    }
    const rangeMatch = text.match(/(\d+)[^\d]+(\d+)/);
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1]);
      const max = parseInt(rangeMatch[2]);
      return { min, max };
    }
    const num = parseInt(text);
    if (!isNaN(num)) return { min: num, max: num };
    return { min: 0, max: Infinity };
  };

  const filteredJobs = data.jobs.filter((job) => {
    // === TITLE MATCH with similar titles ===
    const similarTitles = getSimilarTitles(search);
    const matchesSearch = search
      ? similarTitles.some(title => job.title?.toLowerCase().includes(title.toLowerCase()))
      : true;

    // === LOCATION FILTER ===
    const matchesLocation = locationFilter
      ? job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      : true;

    // === LEVEL FILTER ===
    const matchesLevel = levelFilter ? job.level === levelFilter : true;

    // === EXPERIENCE FILTER ===
    const jobExp = parseExperience(job.experience);
    const userExp = experienceFilter ? parseInt(experienceFilter) : null;
    const matchesExperience = userExp !== null
      ? userExp >= jobExp.min && userExp <= jobExp.max
      : true;

    // === SALARY FILTER ===
    const jobSalary = parseInt(job.salary);
    const matchesSalary = jobSalary >= salaryFilter[0] && jobSalary <= salaryFilter[1];

    return matchesSearch && matchesLocation && matchesLevel && matchesExperience && matchesSalary;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 p-4 md:p-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Job Listings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="md:w-1/4 space-y-4">
          <input
            type="text"
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">All Levels</option>
            <option>Fresher</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior</option>
          </select>

          <input
            type="number"
            min={0}
            placeholder="Experience (years)..."
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Salary Slider */}
          <div className="space-y-2">
            <label className="text-gray-600 text-sm">Salary Range: {salaryFilter[0]} - {salaryFilter[1]}</label>
            <input
              type="range"
              min={salaryMin}
              max={salaryMax}
              value={salaryFilter[0]}
              onChange={(e) => setSalaryFilter([parseInt(e.target.value), salaryFilter[1]])}
              className="w-full"
            />
            <input
              type="range"
              min={salaryMin}
              max={salaryMax}
              value={salaryFilter[1]}
              onChange={(e) => setSalaryFilter([salaryFilter[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Job Cards */}
        <div className="md:flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                currentUser={currentUser}
                data={data}
                setData={setData}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}