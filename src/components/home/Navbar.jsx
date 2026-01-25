import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-blue-600">Find Jobs</h1>

        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/jobs" className="text-gray-700 hover:text-blue-600">Jobs</Link>
          <Link to="/companies" className="text-gray-700 hover:text-blue-600">Companies</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
        </div>

        <div className="space-x-2">
          <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </button>
          <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;