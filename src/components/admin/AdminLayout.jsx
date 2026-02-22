import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLayout() {
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
        ? "bg-green-600 text-white font-semibold"
        : "text-gray-600 hover:bg-green-100"
    }`;

  return (
    <div className="pt-20 flex min-h-screen bg-white">

      {/* ===== Mobile Header ===== */}
      <div 
      id="admin-mobile-header"
      className="fixed top-20 left-0 right-0 bg-white border-b border-green-200 z-40 md:hidden flex justify-between items-center px-4 py-3">
        <h1 className="font-bold text-green-600 text-lg">Admin Panel</h1>
        <button
          onClick={() => setOpen(prev => !prev)}
          className="text-green-600 font-bold text-xl"
        >
          ☰
        </button>
      </div>

      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed top-20 left-0 z-50 w-64 bg-white border-r border-green-200
        h-[calc(100vh-5rem)]
        overflow-y-auto
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-green-200">
          <h1 className="text-xl font-bold text-green-600">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-400">
            System & platform control
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">

          <NavLink
            to="/admin/analytics"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Analytics
          </NavLink>

          <NavLink
            to="/admin/manage-users"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Manage Users
          </NavLink>

          <NavLink
  to="/admin/manage-companies"
  onClick={() => setOpen(false)}
  className={linkClass}
>
  Manage Companies
</NavLink>

<NavLink
  to="/admin/manage-applications"
  onClick={() => setOpen(false)}
  className={linkClass}
>
  Manage Applications
</NavLink>

          <NavLink
            to="/admin/cv-collections"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            CV Collection
          </NavLink>

          <br />

          <button
            onClick={logout}
            className="mt-4 w-20 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>

        </nav>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-4 md:p-6 mt-12 md:mt-0 md:ml-64 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;