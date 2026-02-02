import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateCompanyId, generateColorFromText } from "./utils";

function CompanyRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));

    // Email & Phone uniqueness
    if (data.companies.some(c => c.email === form.email)) {
      alert("Email already registered");
      return;
    }
    if (data.companies.some(c => c.phone === form.phone)) {
      alert("Phone number already registered");
      return;
    }

    const newCompany = {
      companyId: generateCompanyId(data.companies),
      brandColor: generateColorFromText(form.name),
      brandName: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      password: form.password,
    };

    data.companies.push(newCompany);

    // Set as logged in company
    data.others = data.others.map(o =>
      o.type === "currentUser" ? { ...o, data: { ...newCompany, type: "company" } } : o
    );

    localStorage.setItem("Find Jobs Data", JSON.stringify(data));
    window.dispatchEvent(new Event("authChanged"));

    navigate("/company"); // go to company dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 pt-20">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-orange-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">
          Company Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Company Name"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Company Email"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            type="text"
            placeholder="Company Phone Number"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />
          <textarea
            name="address"
            placeholder="Company Address"
            rows="3"
            className="w-full p-3 border rounded resize-none"
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
            Register Company
          </button>
        </form>

        <p className="text-center mt-6 text-lg">
          Already registered?{" "}
          <Link to="/company/login" className="text-orange-600 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CompanyRegister;