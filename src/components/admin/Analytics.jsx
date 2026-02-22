function Analytics() {
  const data = JSON.parse(localStorage.getItem("Find Jobs Data")) || {};

  const userCount = data?.users?.length || 0;
  const totalApplications = data?.applications?.length || 0;

  // Unique users who applied
  const uniqueAppliedUsers = [
    ...new Set(data?.applications?.map(app => app.userId))
  ].length || 0;

  // Applications where status was updated
  const updatedApplications =
    data?.applications?.filter(app => app.dateUpdated !== null).length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-lg">
            Total Registered Users:
            <span className="font-semibold ml-2">{userCount}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-lg">
            Total Applications:
            <span className="font-semibold ml-2">{totalApplications}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-lg">
            Users Who Applied:
            <span className="font-semibold ml-2">{uniqueAppliedUsers}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-lg">
            Applications Updated:
            <span className="font-semibold ml-2">{updatedApplications}</span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Analytics;