function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-blue-600">Find Jobs</h1>
          <div className="space-x-4">
            <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Jobs</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Companies</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
          </div>
          <div className="space-x-2">
            <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
            <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">Register</button>
          </div>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center mt-16 px-4">
        <h2 className="text-4xl font-bold mb-4">Find Your Dream Job</h2>
        <p className="text-gray-600 mb-6">Search thousands of jobs from top companies around the world.</p>
        <div className="flex flex-col md:flex-row gap-2 w-full max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Job title or keyword"
            className="p-3 rounded border border-gray-300 flex-1"
          />
          <input
            type="text"
            placeholder="Location"
            className="p-3 rounded border border-gray-300 flex-1"
          />
          <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Search
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;