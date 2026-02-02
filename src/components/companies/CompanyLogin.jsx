import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CompanyLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));

    const company = data.companies.find(
      c => c.email === form.email && c.password === form.password
    );

    if (!company) {
      alert("Invalid credentials");
      return;
    }

    // Set as logged in company
    data.others = data.others.map(o =>
      o.type === "currentUser" ? { ...o, data: { ...company, type: "company" } } : o
    );

    localStorage.setItem("Find Jobs Data", JSON.stringify(data));
    window.dispatchEvent(new Event("authChanged"));

    navigate("/company"); // go to company dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-orange-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">
          Company Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Company Email"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />
          <button className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600">
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-lg">
          New company?{" "}
          <Link to="/company/register" className="text-orange-600 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CompanyLogin;