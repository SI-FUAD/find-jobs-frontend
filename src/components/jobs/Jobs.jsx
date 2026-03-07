import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import usePageTitle from "../home/usePageTitle";
import JobCard from "./JobCard";
import { getSimilarTitles } from "../home/jobTitleUtils";

export default function Jobs() {
  const [searchParams] = useSearchParams();

  // Filters
  const [search, setSearch] = useState(searchParams.get("title") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const formattedSearch = search?.trim();
const formattedLocation = locationFilter?.trim();

usePageTitle(
  formattedSearch && formattedLocation
    ? `${formattedSearch} jobs in ${formattedLocation}`
    : formattedSearch
    ? `${formattedSearch} jobs`
    : formattedLocation
    ? `jobs in ${formattedLocation}`
    : "Browse Jobs"
);
  const [levelFilter, setLevelFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  // Salary Filters
  const [showNegotiable, setShowNegotiable] = useState(false);
  const [showSalaryRange, setShowSalaryRange] = useState(false);
  const [salaryFilter, setSalaryFilter] = useState([0, 0]);

  const [data, setData] = useState(() =>
    JSON.parse(localStorage.getItem("Find Jobs Data")) || { jobs: [], others: [] }
  );

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("Find Jobs Data")) || { others: [] };
    return stored.others?.find((o) => o.type === "currentUser")?.data || null;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const updatedData =
        JSON.parse(localStorage.getItem("Find Jobs Data")) || { jobs: [], others: [] };
      setData(updatedData);
      const user =
        updatedData.others?.find((o) => o.type === "currentUser")?.data || null;
      setCurrentUser(user);
    };

    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  // ================= ACTIVE JOBS ONLY =================

  const activeJobs = useMemo(() => {
  const today = new Date();

  return data.jobs.filter((job) => {
    if (!job.deadline) return false;
    return new Date(job.deadline) >= today;
  });
}, [data.jobs]);

  // ================= SALARY MIN MAX FROM ACTIVE JOBS =================

  const numericSalaries = activeJobs
    .map((j) => (j.salary !== "Negotiable" ? parseInt(j.salary) : null))
    .filter((s) => !isNaN(s));

  const salaryMin = numericSalaries.length ? Math.min(...numericSalaries) : 0;
  const salaryMax = numericSalaries.length ? Math.max(...numericSalaries) : 100000;

  // Keep slider in sync safely without cascading renders
if (
  salaryFilter[0] < salaryMin ||
  salaryFilter[1] > salaryMax ||
  salaryFilter[0] === 0 && salaryFilter[1] === 0
) {
  setSalaryFilter([salaryMin, salaryMax]);
}

  // ================= EXPERIENCE PARSER =================

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
      return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
    }

    const num = parseInt(text);
    if (!isNaN(num)) return { min: num, max: num };

    return { min: 0, max: Infinity };
  };

  // ================= FILTERED JOBS =================

  const filteredJobs = activeJobs.filter((job) => {
    // Title
    const similarTitles = getSimilarTitles(search);
    const matchesSearch = search
      ? similarTitles.some((title) =>
          job.title?.toLowerCase().includes(title.toLowerCase())
        )
      : true;

    // Location
    const matchesLocation = locationFilter
      ? job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      : true;

    // Level
    const matchesLevel = levelFilter ? job.level === levelFilter : true;

    // Experience
    const jobExp = parseExperience(job.experience);
    const userExp = experienceFilter ? parseInt(experienceFilter) : null;
    const matchesExperience =
      userExp !== null
        ? userExp >= jobExp.min && userExp <= jobExp.max
        : true;

    // Salary
    let matchesSalary = true;

    if (showNegotiable || showSalaryRange) {
      matchesSalary = false;

      if (showNegotiable && job.salary === "Negotiable") {
        matchesSalary = true;
      }

      if (
        showSalaryRange &&
        job.salary !== "Negotiable" &&
        !isNaN(parseInt(job.salary))
      ) {
        const jobSalary = parseInt(job.salary);
        if (
          jobSalary >= salaryFilter[0] &&
          jobSalary <= salaryFilter[1]
        ) {
          matchesSalary = true;
        }
      }
    }

    return (
      matchesSearch &&
      matchesLocation &&
      matchesLevel &&
      matchesExperience &&
      matchesSalary
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 p-4 md:p-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Active Job Listings ({activeJobs.length})
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
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

          {/* Salary Section */}
          <div className="space-y-2 border-t pt-4">
            <label className="font-semibold text-gray-700">Salary</label>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showNegotiable}
                onChange={() => setShowNegotiable(!showNegotiable)}
              />
              <span>Negotiable</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSalaryRange}
                onChange={() => setShowSalaryRange(!showSalaryRange)}
              />
              <span>Salary Range</span>
            </div>

            {showSalaryRange && (
              <div className="space-y-2">
                <label className="text-gray-600 text-sm">
                  {salaryFilter[0]} - {salaryFilter[1]}
                </label>

                <input
                  type="range"
                  min={salaryMin}
                  max={salaryMax}
                  value={salaryFilter[0]}
                  onChange={(e) =>
                    setSalaryFilter([
                      Math.min(parseInt(e.target.value), salaryFilter[1]),
                      salaryFilter[1],
                    ])
                  }
                  className="w-full"
                />

                <input
                  type="range"
                  min={salaryMin}
                  max={salaryMax}
                  value={salaryFilter[1]}
                  onChange={(e) =>
                    setSalaryFilter([
                      salaryFilter[0],
                      Math.max(parseInt(e.target.value), salaryFilter[0]),
                    ])
                  }
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Jobs */}
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
            <p className="text-gray-500 col-span-full">
              No jobs found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}