function ManageApplications() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Manage Applications
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-gray-600">
          This page will manage all job applications submitted by users.
        </p>

        <div className="mt-4 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            🚀 Future features:
          </p>
          <ul className="list-disc ml-5 mt-2 text-gray-600 text-sm space-y-1">
            <li>View all applications</li>
            <li>Filter by job or company</li>
            <li>Shortlist / Reject application</li>
            <li>Delete applications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ManageApplications;