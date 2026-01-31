import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa"; // For the downward arrow

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
      setCurrentUser(data?.others.find(o => o.type === "currentUser")?.data || null);
    };
    window.addEventListener("authChanged", sync);
    return () => window.removeEventListener("authChanged", sync);
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive ? "text-blue-400" : "text-gray-300 hover:text-white transition";

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

        {/* Logo – display only */}
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
          {!currentUser ? (
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
            </>
          ) : (
            <>
              {/* Avatar with downward arrow */}
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

              {/* Dropdown */}
              {avatarOpen && (
                <div className="absolute right-0 top-12 bg-black border border-white/10 rounded-xl w-40 overflow-hidden">
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
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden relative">
          {currentUser ? (
            // Logged in → avatar
            <div
              onClick={() => setMobileMenu(prev => !prev)}
              className="flex items-center gap-1 cursor-pointer select-none"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: currentUser.userLogoColor }}
              >
                {currentUser.userLogoText}
              </div>
              <FaChevronDown className="text-white" />
            </div>
          ) : (
            // Logged out → hamburger
            <button
              onClick={() => setMobileMenu(prev => !prev)}
              className="text-white text-2xl"
            >
              ☰
            </button>
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
            {!currentUser ? (
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
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenu(false); navigate("/dashboard"); }}
                  className="w-full py-2 rounded-lg text-white border border-white/30"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { setMobileMenu(false); navigate("/profile"); }}
                  className="w-full py-2 rounded-lg text-white border border-white/30"
                >
                  Profile
                </button>
                <button
                  onClick={() => { setMobileMenu(false); handleLogout(); }}
                  className="w-full py-2 rounded-lg text-red-400 border border-white/30"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;