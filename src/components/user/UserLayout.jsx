import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

function UserLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));

    data.others = data.others.map(o =>
      o.type === "currentUser" ? { ...o, data: null } : o
    );

    localStorage.setItem("Find Jobs Data", JSON.stringify(data));
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-white/10"
    }`;

  return (
  <div className="bg-gray-100 pt-20 flex min-h-screen">

    {/* ===== Mobile Header (MISSING PART) ===== */}
    <div
  id="user-mobile-header"
  className="fixed top-20 left-0 right-0 bg-white border-b z-40 md:hidden flex justify-between items-center px-4 py-3 print:hidden">
      <h1 className="font-bold text-blue-600 text-lg">User Panel</h1>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="text-blue-600 font-bold text-xl"
      >
        ☰
      </button>
    </div>

    {/* ===== Sidebar (FIXED) ===== */}
    <aside
  className={`fixed top-20 left-0 z-50 w-64 bg-black border-r border-gray-800
    h-[calc(100vh-5rem)]
    overflow-y-auto
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 print:hidden`}>
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">User Panel</h1>
        <p className="text-sm text-gray-400">
          Manage your profile & jobs
        </p>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/profile" onClick={() => setOpen(false)} className={linkClass}>
          Profile
        </NavLink>

        <NavLink to="/my-cv" onClick={() => setOpen(false)} className={linkClass}>
          My CV
        </NavLink>

        <NavLink to="/saved-jobs" onClick={() => setOpen(false)} className={linkClass}>
          Saved Jobs
        </NavLink>

        <NavLink to="/applied-jobs" onClick={() => setOpen(false)} className={linkClass}>
          Applied Jobs
        </NavLink>

        <NavLink to="/applied-jobs-status" onClick={() => setOpen(false)} className={linkClass}>
          Applied Jobs Status
        </NavLink>

        <br />

        <button
          onClick={logout}
          className="mt-4 w-20 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-500/10"
        >
          Logout
        </button>
      </nav>
    </aside>

    {/* ===== Main Content (SCROLLABLE ONLY) ===== */}
    <main className="flex-1 p-4 md:p-6 mt-12 md:mt-0 md:ml-64 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);
}

export default UserLayout;