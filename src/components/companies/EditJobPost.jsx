import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EditJobPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedData = JSON.parse(localStorage.getItem("Find Jobs Data"));
  const job = storedData?.jobs?.find(j => j.id === id);

  const [form, setForm] = useState(job ? { ...job } : null);

  if (!job) {
    return <p className="p-6 text-red-500">Job not found</p>;
  }

  const handleChange = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    // ✅ create new jobs array (NO mutation)
    const updatedJobs = storedData.jobs.map(j =>
      j.id === id ? { ...form } : j
    );

    // ✅ create new data object
    const updatedData = {
      ...storedData,
      jobs: updatedJobs
    };

    localStorage.setItem("Find Jobs Data", JSON.stringify(updatedData));
    navigate("/company/manage-jobs");
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 pt-24">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Job Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full border rounded-lg p-3"
            required
          />

          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">Select Job Level</option>
            <option>Fresher</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior</option>
          </select>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border rounded-lg p-3"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="w-full border rounded-lg p-3 min-h-[120px]"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="vacancy"
              type="number"
              value={form.vacancy}
              onChange={handleChange}
              placeholder="Vacancy"
              className="border rounded-lg p-3"
              required
            />
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Experience (text allowed)"
              className="border rounded-lg p-3"
              required
            />
          </div>

          <input
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="Salary or Negotiable"
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/company/manage-jobs")}
              className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              Back
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}