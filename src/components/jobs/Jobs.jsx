function Jobs() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Available Jobs</h1>
        <p className="text-gray-600 mb-6">
          Browse job opportunities from top companies around the world.
        </p>

        <div className="grid gap-4">
          <div className="border p-4 rounded hover:shadow transition">
            <h3 className="font-semibold text-lg">Frontend Developer</h3>
            <p className="text-sm text-gray-500">Remote · Full Time</p>
          </div>

          <div className="border p-4 rounded hover:shadow transition">
            <h3 className="font-semibold text-lg">Backend Developer</h3>
            <p className="text-sm text-gray-500">Dhaka · Full Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;