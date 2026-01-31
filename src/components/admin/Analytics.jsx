function Analytics() {
  const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
  const userCount = data?.users.length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Analytics</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-lg">
          Total Registered Users:
          <span className="font-semibold ml-2">{userCount}</span>
        </p>
      </div>
    </div>
  );
}

export default Analytics;