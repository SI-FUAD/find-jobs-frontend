import { NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-400"
      : "text-gray-300 hover:text-white transition";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Find Jobs" className="w-8 h-8" />
          <span className="text-xl font-bold text-white">Find Jobs</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>
          <NavLink to="/companies" className={navLinkClass}>Companies</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <NavLink
            to="/login"
            className="px-4 py-1.5 rounded-lg text-white border border-white/30 hover:bg-white/10 transition"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white"
          >
            Register
          </NavLink>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black px-6 py-6 flex flex-col gap-4">
          <NavLink onClick={() => setOpen(false)} to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/companies" className={navLinkClass}>
            Companies
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/about" className={navLinkClass}>
            About
          </NavLink>

          <div className="pt-4 flex flex-col gap-3 border-t border-white/10">
            <NavLink
              onClick={() => setOpen(false)}
              to="/login"
              className="w-full text-center py-2 rounded-lg border border-white/30 text-white"
            >
              Login
            </NavLink>

            <NavLink
              onClick={() => setOpen(false)}
              to="/register"
              className="w-full text-center py-2 rounded-lg bg-blue-600 text-white"
            >
              Register
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;