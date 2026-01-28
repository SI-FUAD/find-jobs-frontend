function Companies() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Top Companies</h1>
        <p className="text-gray-600 mb-6">
          Discover companies that are hiring right now.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border p-4 rounded hover:shadow transition">
            <h3 className="font-semibold">Google</h3>
            <p className="text-sm text-gray-500">Technology</p>
          </div>

          <div className="border p-4 rounded hover:shadow transition">
            <h3 className="font-semibold">Microsoft</h3>
            <p className="text-sm text-gray-500">Software</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Companies;