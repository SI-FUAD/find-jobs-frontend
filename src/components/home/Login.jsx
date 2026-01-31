import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));

    /* =======================
       ✅ ADMIN LOGIN CHECK
    ======================== */
    if (
      form.email === "admin@findjobs.com" &&
      form.password === "admin123"
    ) {
      navigate("/admin");
      return;
    }

    /* =======================
       ✅ NORMAL USER LOGIN
    ======================== */
    const user = data.users.find(
      u => u.email === form.email && u.password === form.password
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    data.others = data.others.map(o =>
      o.type === "currentUser" ? { ...o, data: user } : o
    );

    localStorage.setItem("Find Jobs Data", JSON.stringify(data));
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
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
          <button className="w-full bg-blue-600 text-white py-3 rounded">
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;