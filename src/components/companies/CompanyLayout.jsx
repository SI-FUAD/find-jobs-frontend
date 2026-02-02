import { Outlet, NavLink, useNavigate } from "react-router-dom";

function CompanyLayout() {
  const navigate = useNavigate();

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
    isActive ? "text-orange-600 font-bold" : "text-gray-700";

  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Company Dashboard</h1>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-60 bg-white p-4 border-r border-orange-200">
          <ul className="flex flex-col gap-3">
            <li>
              <NavLink to="/company" end className={navLinkClass}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/company/add-job" className={navLinkClass}>
                Add New Job
              </NavLink>
            </li>
            <li>
              <NavLink to="/company/manage-jobs" className={navLinkClass}>
                Manage Jobs
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 border border-red-400 px-3 py-1 rounded"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6 bg-orange-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CompanyLayout;