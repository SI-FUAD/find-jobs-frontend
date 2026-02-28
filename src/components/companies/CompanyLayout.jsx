import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function CompanyLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
    data.others = data.others.map(o =>
      o.type === "currentUser" ? { ...o, data: null } : o
    );
    localStorage.setItem("Find Jobs Data", JSON.stringify(data));
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-orange-500 text-white font-semibold"
        : "text-gray-600 hover:bg-orange-100"
    }`;

  return (
    <div
    id="company-layout-wrapper"
    className="bg-orange-50 pt-20 flex h-[calc(100vh-5rem)] overflow-hidden">

      {/* Mobile Header */}
      <div
      id="company-mobile-header"
      className="fixed top-20 left-0 right-0 bg-white border-b z-40 md:hidden flex justify-between items-center px-4 py-3">
        <h1 className="font-bold text-orange-600 text-lg">Company Panel</h1>
        <button
          onClick={() => setOpen(!open)}
          className="text-orange-600 font-bold text-xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
      className={`fixed md:static top-20 left-0 z-50 w-64 bg-white border-r border-orange-200 h-[calc(100vh-5rem)]
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-orange-600">
            Company Panel
          </h1>
          <p className="text-sm text-gray-400">
            Manage your hiring
          </p>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink to="/company" end className={navLinkClass} onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>

          <NavLink to="/company/add-job" className={navLinkClass} onClick={() => setOpen(false)}>
            Add Job Post
          </NavLink>

          <NavLink to="/company/manage-jobs" className={navLinkClass} onClick={() => setOpen(false)}>
            Manage Jobs
          </NavLink>

          <NavLink to="/company/candidates" className={navLinkClass} onClick={() => setOpen(false)}>
            Candidates
          </NavLink>

          <br />
          <button
            onClick={handleLogout}
            className="mt-4 w-20 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
      id="company-scroll"
      className="flex-1 p-4 md:p-6 mt-12 md:mt-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default CompanyLayout;