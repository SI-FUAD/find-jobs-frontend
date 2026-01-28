function Footer() {
  return (
    <footer className="bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">Find Jobs</h3>
          <p className="text-sm">
            Helping you find the right career opportunities worldwide.
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>Jobs</li>
            <li>Companies</li>
            <li>About</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 text-sm">
        © {new Date().getFullYear()} Find Jobs. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;