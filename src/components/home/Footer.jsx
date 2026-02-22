import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const goToSection = (sectionId) => {
  const navHeight = 96; // adjust if your navbar height is different
  navigate("/about");
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, 150);
};

  return (
    <footer className="bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-3">
              Find Jobs
            </h3>
            <p className="text-xs leading-relaxed">
              Connecting talent with opportunity worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs" className="hover:text-white transition">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-white transition">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* User */}
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">
              User
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/company/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/company/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => goToSection("privacy")}
                  className="hover:text-white transition text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToSection("terms")}
                  className="hover:text-white transition text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Find Jobs. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;