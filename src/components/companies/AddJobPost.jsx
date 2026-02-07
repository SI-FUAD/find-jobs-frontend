import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddJobPost() {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
  const currentUser = data?.others?.find(o => o.type === "currentUser")?.data;

  const [form, setForm] = useState({
    title: "",
    level: "",
    location: "",
    description: "",
    vacancy: "",
    experience: "",
    salary: "",
    deadline: ""
  });

  if (!currentUser?.companyId) {
    return <p className="p-6 text-red-500">Unauthorized</p>;
  }

  // Generate unique 10-digit Job ID with prefix j_
  const generateJobId = () => {
    let id;
    do {
      let digits = "";
      for (let i = 0; i < 10; i++) {
        digits += Math.floor(Math.random() * 10);
      }
      id = `j_${digits}`;
    } while (data.jobs.some(job => job.id === id));
    return id;
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ["title", "level", "location", "description", "vacancy", "experience", "deadline"];
    for (let field of requiredFields) {
      if (!form[field]) {
        alert(`Please fill the ${field} field`);
        return;
      }
    }

    // Validate deadline is not in the past
    const today = new Date().toISOString().split("T")[0];
    if (form.deadline < today) {
      alert("Deadline cannot be in the past");
      return;
    }

    const newJob = {
      id: generateJobId(),
      companyId: currentUser.companyId,
      companyName: currentUser.brandName,
      title: form.title,
      level: form.level,
      location: form.location,
      description: form.description,
      vacancy: Number(form.vacancy),
      experience: form.experience,
      salary: form.salary || "Negotiable",
      datePosted: today,
      deadline: form.deadline
    };

    data.jobs.push(newJob);
    localStorage.setItem("Find Jobs Data", JSON.stringify(data));
    navigate("/company/manage-jobs");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl p-4 md:p-6 shadow">
      <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Company</label>
        <div className="px-4 py-2 bg-gray-100 rounded-lg">
          {currentUser.brandName}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select Job Level</option>
          <option>Fresher</option>
          <option>Entry Level</option>
          <option>Mid Level</option>
          <option>Senior</option>
        </select>

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <textarea
          name="description"
          placeholder="Job Description"
          rows="5"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="vacancy"
            placeholder="Vacancy"
            value={form.vacancy}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="experience"
            placeholder="Experience (e.g., Fresher, 1-3 years)"
            value={form.experience}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />
        </div>

        <input
          name="salary"
          placeholder="Salary or Negotiable"
          value={form.salary}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold"
        >
          Publish Job
        </button>
      </form>
    </div>
  );
}