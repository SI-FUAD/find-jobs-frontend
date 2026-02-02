function CompanyDashboard() {
  const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
  const company = data.others.find(o => o.type === "currentCompany")?.data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-600 mb-4">
        Welcome, {company?.name}
      </h1>

      <div className="bg-white p-6 rounded shadow border">
        <p><strong>Email:</strong> {company?.email}</p>
        <p className="mt-2"><strong>Address:</strong> {company?.address}</p>
      </div>
    </div>
  );
}

export default CompanyDashboard;