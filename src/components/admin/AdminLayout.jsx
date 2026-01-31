import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

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
    `block px-4 py-2 rounded-lg ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-white/10"
    }`;

  return (
    <div className="flex min-h-screen pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-black p-6 space-y-2">
        <NavLink to="/admin" end className={linkClass}>
          Analytics
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          Manage Users
        </NavLink>

        <NavLink to="/admin/cv" className={linkClass}>
          CV Collection
        </NavLink>

        <button
          onClick={logout}
          className="mt-6 text-red-400 px-4"
        >
          Logout
        </button>
      </aside>

      {/* Right Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;