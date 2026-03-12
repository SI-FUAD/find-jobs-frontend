import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePageTitle from "./usePageTitle";
import { generateFakeData } from "../admin/fakeDataGenerator";

export default function Home() {
  usePageTitle("Home - Discover Your Dream Career");

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Pass filters via query params
    const params = new URLSearchParams();
    if (jobTitle) params.append("title", jobTitle);
    if (location) params.append("location", location);

    navigate(`/jobs?${params.toString()}`);
  };

  const [actionMessage, setActionMessage] = useState("");

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

  setActionMessage("Fake demo data imported successfully! You can now explore the full website.");
};

const handleClearFakeData = () => {
  const existingData = JSON.parse(localStorage.getItem("Find Jobs Data")) || {};

  const newData = {
    ...existingData,
    users: [],
    companies: [],
    jobs: [],
    applications: [],
  };

  localStorage.setItem("Find Jobs Data", JSON.stringify(newData));

  setActionMessage("All demo data cleared successfully.");
};

  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/55"></div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-4">
          <div className="max-w-4xl mx-auto text-center text-white mt-[-120px]">

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your <span className="text-blue-400">Dream Job</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Discover thousands of opportunities with top companies worldwide.
            </p>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Job title or keyword"
                className="flex-1 px-4 py-3 rounded-lg outline-none text-black"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 px-4 py-3 rounded-lg outline-none text-black"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>

            {/* Demo Data Section */}
<div className="mt-8 bg-white/10 backdrop-blur-sm p-4 rounded-2xl text-center">

  <p className="text-gray-300 mb-4 text-sm md:text-base">
    Want to explore the full platform with sample users, companies, jobs and applications?
    Import demo data instantly and test all features.
  </p>

  <div className="flex flex-col sm:flex-row justify-center gap-3">

    <button
      onClick={handleImportFakeData}
      className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
    >
      Import Demo Data
    </button>

    <button
      onClick={handleClearFakeData}
      className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
    >
      Clear Demo Data
    </button>

  </div>

  {actionMessage && (
    <p className="text-green-400 mt-3 text-sm">
      {actionMessage}
    </p>
  )}

</div>

          </div>
        </div>
      </div>
    </section>
  );
}