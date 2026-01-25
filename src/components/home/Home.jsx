function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center mt-16 px-4">
      <h2 className="text-4xl font-bold mb-4">Find Your Dream Job</h2>
      <p className="text-gray-600 mb-6">
        Search thousands of jobs from top companies around the world.
      </p>

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
  );
}

export default Home;