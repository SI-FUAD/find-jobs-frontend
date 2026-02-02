import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

// Down arrow
function Navbar() {
  const navigate = useNavigate();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
    return data?.others.find(o => o.type === "currentUser")?.data || null;
  });

  // Sync login/logout across app
  useEffect(() => {
    const sync = () => {
      const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
      setCurrentUser(
        data?.others.find(o => o.type === "currentUser")?.data || null
      );
    };
    sync();
    window.addEventListener("authChanged", sync);
    return () => window.removeEventListener("authChanged", sync);
  }, []);

  const isAdmin = currentUser?.email === "admin@findjobs.com";

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-400"
      : "text-gray-300 hover:text-white transition";

  const handleLogout = () => {
    const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
    data.others = data.others.map(o =>
      o.type === "currentUser" ? { ...o, data: null } : o
    );
    localStorage.setItem("Find Jobs Data", JSON.stringify(data));
    window.dispatchEvent(new Event("authChanged"));
    setAvatarOpen(false);
    setMobileMenu(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2 select-none">
          <img src="/logo.png" className="w-8 h-8" alt="Find Jobs Logo" />
          <span className="text-xl font-bold text-white">Find Jobs</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>
          <NavLink to="/companies" className={navLinkClass}>Companies</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
        </div>

        {/* Desktop Auth / Avatar */}
        <div className="hidden md:flex items-center gap-3 relative">

          {!currentUser && (
            <>
              <NavLink
                to="/login"
                className="border border-white/30 px-4 py-1.5 rounded-lg text-white"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="bg-blue-600 px-4 py-1.5 rounded-lg text-white"
              >
                Register
              </NavLink>

              <NavLink
                to="/company/login"
                className="bg-orange-500 px-4 py-1.5 rounded-lg text-white"
              >
                Hire Employee
              </NavLink>
            </>
          )}

          {/* Company */}
          {currentUser?.companyId && (
            <div
              onClick={() => setAvatarOpen(prev => !prev)}
              className="px-4 py-2 rounded-lg font-semibold cursor-pointer text-white flex items-center gap-1"
              style={{ backgroundColor: currentUser.brandColor }}
            >
              <span className="truncate">{currentUser.brandName}</span>
              <FaChevronDown />
            </div>
          )}

          {/* Admin */}
          {currentUser && isAdmin && (
            <div
              onClick={() => setAvatarOpen(prev => !prev)}
              className="px-4 py-2 rounded-lg font-semibold cursor-pointer text-white flex items-center gap-1"
              style={{ backgroundColor: "#059669" }}
            >
              Admin Panel
              <FaChevronDown />
            </div>
          )}

          {/* User */}
          {currentUser && !isAdmin && !currentUser?.companyId && (
            <div
              onClick={() => setAvatarOpen(prev => !prev)}
              className="flex items-center gap-1 w-auto rounded-full cursor-pointer select-none"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: currentUser.userLogoColor }}
              >
                {currentUser.userLogoText}
              </div>
              <FaChevronDown className="text-white" />
            </div>
          )}

          {/* Dropdown menu */}
          {avatarOpen && (
            <div className="absolute right-0 top-12 rounded-xl overflow-hidden w-48 border border-white/10 bg-black/90">

              {/* Company Dropdown */}
              {currentUser?.companyId && (
                <>
                  <button
                    onClick={() => { setAvatarOpen(false); navigate("/company"); }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => { setAvatarOpen(false); navigate("/company/add-job"); }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                  >
                    Add Job
                  </button>

                  <button
                    onClick={() => { setAvatarOpen(false); navigate("/company/manage-jobs"); }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                  >
                    Manage Jobs
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* Admin Dropdown */}
              {currentUser && isAdmin && (
                <>
                  <button
                    onClick={() => { setAvatarOpen(false); navigate("/admin/analytics"); }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                  >
                    Analytics
                  </button>

                  <button
                    onClick={() => { setAvatarOpen(false); navigate("/admin/manage-users"); }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                  >
                    Manage Users
                  </button>

                  <button
                    onClick={() => { setAvatarOpen(false); navigate("/admin/cv-collections"); }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                  >
                    CV Collections
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* User Dropdown */}
              {currentUser && !isAdmin && !currentUser?.companyId && (
                <>
                  <button
                    onClick={() => { setAvatarOpen(false); navigate("/dashboard"); }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => { setAvatarOpen(false); navigate("/profile"); }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden relative">
          {!currentUser ? (
            <button
              onClick={() => setMobileMenu(prev => !prev)}
              className="text-white text-2xl"
            >
              ☰
            </button>
          ) : (
            <div
              onClick={() => setMobileMenu(prev => !prev)}
              className="flex items-center gap-1 cursor-pointer select-none"
            >
              <div
                className={`flex items-center justify-center font-semibold text-white ${
                  isAdmin || currentUser?.companyId
                  ? "rounded-lg px-3 py-1"   // rectangle for company & admin
                  : "w-10 h-10 rounded-full" // circle for normal user
                  }`}
                style={{
                  backgroundColor: isAdmin
                  ? "#059669"
                  : currentUser?.companyId
                  ? currentUser.brandColor
                  : currentUser?.userLogoColor
                }}
              >
                {isAdmin
                ? "Admin Panel"
                : currentUser?.companyId
                ? currentUser.brandName
                : currentUser.userLogoText
                }

              </div>
              <FaChevronDown className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-black px-6 py-6 flex flex-col gap-4">

          <NavLink onClick={() => setMobileMenu(false)} to="/" className={navLinkClass}>Home</NavLink>
          <NavLink onClick={() => setMobileMenu(false)} to="/jobs" className={navLinkClass}>Jobs</NavLink>
          <NavLink onClick={() => setMobileMenu(false)} to="/companies" className={navLinkClass}>Companies</NavLink>
          <NavLink onClick={() => setMobileMenu(false)} to="/about" className={navLinkClass}>About</NavLink>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">

            {/* Logged out */}
            {!currentUser && (
              <>
                <NavLink
                  onClick={() => setMobileMenu(false)}
                  to="/login"
                  className="w-full text-center py-2 rounded-lg border border-white/30 text-white"
                >
                  Login
                </NavLink>

                <NavLink
                  onClick={() => setMobileMenu(false)}
                  to="/register"
                  className="w-full text-center py-2 rounded-lg bg-blue-600 text-white"
                >
                  Register
                </NavLink>

                <NavLink
                  onClick={() => setMobileMenu(false)}
                  to="/company/login"
                  className="w-full text-center py-2 rounded-lg bg-orange-500 text-white"
                >
                  Hire Employee
                </NavLink>
              </>
            )}

            {/* Company Mobile Dropdown */}
            {currentUser?.companyId && (
              <>
                <button onClick={() => { setMobileMenu(false); navigate("/company"); }} className="w-full py-2 rounded-lg text-white bg-orange-500">Dashboard</button>
                <button onClick={() => { setMobileMenu(false); navigate("/company/add-job"); }} className="w-full py-2 rounded-lg text-white bg-orange-500">Add Job</button>
                <button onClick={() => { setMobileMenu(false); navigate("/company/manage-jobs"); }} className="w-full py-2 rounded-lg text-white bg-orange-500">Manage Jobs</button>
                <button onClick={() => { setMobileMenu(false); handleLogout(); }} className="w-full py-2 rounded-lg text-red-400 bg-black/20">Logout</button>
              </>
            )}

            {/* Admin Mobile Dropdown */}
            {currentUser && isAdmin && (
              <>
                <button onClick={() => { setMobileMenu(false); navigate("/admin/analytics"); }} className="w-full py-2 rounded-lg text-white bg-green-600">Analytics</button>
                <button onClick={() => { setMobileMenu(false); navigate("/admin/manage-users"); }} className="w-full py-2 rounded-lg text-white bg-green-600">Manage Users</button>
                <button onClick={() => { setMobileMenu(false); navigate("/admin/cv-collections"); }} className="w-full py-2 rounded-lg text-white bg-green-600">CV Collections</button>
                <button onClick={() => { setMobileMenu(false); handleLogout(); }} className="w-full py-2 rounded-lg text-red-400 bg-black/20">Logout</button>
              </>
            )}

            {/* User Mobile Dropdown */}
            {currentUser && !isAdmin && !currentUser?.companyId && (
              <>
                <button onClick={() => { setMobileMenu(false); navigate("/dashboard"); }} className="w-full py-2 rounded-lg text-white border border-white/30">Dashboard</button>
                <button onClick={() => { setMobileMenu(false); navigate("/profile"); }} className="w-full py-2 rounded-lg text-white border border-white/30">Profile</button>
                <button onClick={() => { setMobileMenu(false); handleLogout(); }} className="w-full py-2 rounded-lg text-red-400 border border-white/30">Logout</button>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;