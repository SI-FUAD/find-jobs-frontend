import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageCompanies() {
  const navigate = useNavigate();

  const companies = useMemo(() => {
    const stored =
      JSON.parse(localStorage.getItem("Find Jobs Data")) || { companies: [] };

    return stored.companies || [];
  }, []);

  const [search, setSearch] = useState("");

  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return companies;

    const lower = search.toLowerCase();

    return companies.filter((company) =>
      company.companyId?.toLowerCase().includes(lower) ||
      company.brandName?.toLowerCase().includes(lower) ||
      company.email?.toLowerCase().includes(lower) ||
      company.phone?.toLowerCase().includes(lower)
    );
  }, [companies, search]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-orange-50 min-h-screen rounded-t-3xl p-4 md:p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-orange-700">
            Manage Companies
          </h1>

          <input
            type="text"
            placeholder="Search by ID, name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[500px] px-4 py-2 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white"
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-orange-100">
              <tr>
                <th className="p-3">Company ID</th>
                <th className="p-3">Company Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No companies found
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr
                    key={company.companyId}
                    className="border-t hover:bg-orange-50 transition"
                  >
                    <td className="p-3 font-mono">{company.companyId}</td>
                    <td className="p-3 font-medium">{company.brandName}</td>
                    <td className="p-3">{company.email}</td>
                    <td className="p-3">{company.phone || "-"}</td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/company-details/${company.companyId}`)
                        }
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {filteredCompanies.length === 0 ? (
            <p className="text-center text-gray-500">No companies found</p>
          ) : (
            filteredCompanies.map((company) => (
              <div
                key={company.companyId}
                className="bg-white rounded-2xl p-4 shadow-md hover:bg-orange-100 transition"
              >
                <div className="text-sm font-mono text-gray-500">
                  <b>Company ID:</b> {company.companyId}
                </div>

                <h2 className="text-xl font-semibold mt-1">
                  {company.brandName}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  <b>Email:</b> {company.email}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  <b>Phone:</b> {company.phone || "-"}
                </p>

                <div className="mt-4">
                  <button
                    onClick={() =>
                      navigate(`/admin/company-details/${company.companyId}`)
                    }
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}