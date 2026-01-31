import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateUserId = (users) => {
    let id;
    do {
      id = "u_" + Math.floor(100000 + Math.random() * 900000);
    } while (users.some((u) => u.userId === id));
    return id;
  };

const generateColorFromText = (text) => {
  const colors = [
    "#2563eb", // blue
    "#4f46e5", // indigo
    "#7c3aed", // purple
    "#059669", // green
    "#0d9488", // teal
    "#ea580c", // orange
    "#dc2626", // red
  ];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash += text.charCodeAt(i);
  }

  return colors[hash % colors.length];
};

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));

    // Email uniqueness
    const exists = data.users.find(
      (u) => u.email === form.email
    );
    if (exists) {
      alert("Email already registered");
      return;
    }

const initials =
  form.firstName[0].toUpperCase() +
  form.lastName[0].toUpperCase();

const newUser = {
  userId: generateUserId(data.users),
  userLogoText: initials,
  userLogoColor: generateColorFromText(initials),
  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email,
  password: form.password,
};

    data.users.push(newUser);

    data.others = data.others.map((o) =>
      o.type === "currentUser"
        ? { ...o, data: newUser }
        : o
    );

    localStorage.setItem("Find Jobs Data", JSON.stringify(data));
    window.dispatchEvent(new Event("authChanged"));
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              name="firstName"
              placeholder="First Name"
              className="w-1/2 p-3 border rounded"
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="w-1/2 p-3 border rounded"
              onChange={handleChange}
              required
            />
          </div>

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

          <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;