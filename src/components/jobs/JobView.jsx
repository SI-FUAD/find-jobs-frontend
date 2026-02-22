import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bookmark } from "lucide-react";

export default function JobView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("Find Jobs Data")) || {}
  );
  const [modal, setModal] = useState(null); // null | "confirm" | "success"

  const job = data?.jobs?.find(j => j.id === id);
  const currentUser =
    data?.others?.find(o => o.type === "currentUser")?.data || null;

  // ✅ Local states so UI updates immediately
  const [isSaved, setIsSaved] = useState(
    currentUser?.savedJobs?.includes(job.id)
  );

  const hasApplied =
    currentUser &&
    data.applications?.some(
      (app) => app.jobId === id && app.userId === currentUser.userId
    );

  if (!job) return <div className="pt-40 p-6 text-center">Job not found</div>;

  const isLoggedIn = !!currentUser;
  const isCompany = currentUser?.companyId;
  const isAdmin = currentUser?.email === "admin@findjobs.com";
  const canShowButtons = !isCompany && !isAdmin;

  // ---------------- SAVE FUNCTION ----------------
 const handleSave = () => {
  if (!isLoggedIn) {
    setModal("login");
    return;
  }

  const alreadySaved = currentUser.savedJobs?.includes(job.id);

  setData(prevData => {
    const usersCopy = [...(prevData.users || [])];

    const userIndex = usersCopy.findIndex(
      u => u.userId === currentUser.userId
    );

    if (userIndex === -1) return prevData;

    let updatedSavedJobs = usersCopy[userIndex].savedJobs || [];

    if (alreadySaved) {
      updatedSavedJobs = updatedSavedJobs.filter(id => id !== job.id);
    } else {
      updatedSavedJobs = [...updatedSavedJobs, job.id];
    }

    usersCopy[userIndex] = {
      ...usersCopy[userIndex],
      savedJobs: updatedSavedJobs
    };

    const updatedData = {
      ...prevData,
      users: usersCopy,
      others: prevData.others.map(o =>
        o.type === "currentUser"
          ? { ...o, data: usersCopy[userIndex] }
          : o
      )
    };

    localStorage.setItem("Find Jobs Data", JSON.stringify(updatedData));

    return updatedData;
  });

  setIsSaved(!alreadySaved);
  setModal("saveSuccess");
};

  // ---------------- APPLY FUNCTION ----------------
const handleApply = () => {
  if (!isLoggedIn) {
    setModal("login");
    return;
  }

    if (hasApplied) {
      alert("You have already applied for this job.");
      return;
    }

    setModal("confirm"); // open confirmation modal
  };

  const confirmApply = () => {
    // Update user appliedJobs
    const updatedUser = {
      ...currentUser,
      appliedJobs: [...(currentUser.appliedJobs || []), job.id],
    };

    // Update applications array
    const newApplication = {
      id: "a_" + Date.now(),
      jobId: job.id,
      userId: currentUser.userId,
      status: "Applied",
      dateApplied: new Date().toISOString(),
      dateUpdated: null,
    };

    const updatedData = {
      ...data,
      others: data.others.map(o =>
        o.type === "currentUser" ? { ...o, data: updatedUser } : o
      ),
      applications: [...(data.applications || []), newApplication],
    };

    localStorage.setItem("Find Jobs Data", JSON.stringify(updatedData));
    setData(updatedData);

    // Close confirm modal and show success modal
    setModal("success");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-36 px-4 md:px-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 font-semibold px-4 py-2 border border-blue-600 rounded-lg mb-6 w-fit"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-6">

        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
          <p className="text-gray-600 mt-2">{job.companyName}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Detail label="Job ID" value={job.id} />
          <Detail label="Level" value={job.level} />
          <Detail label="Location" value={job.location} />
          <Detail label="Vacancy" value={job.vacancy} />
          <Detail label="Experience" value={job.experience} />
          <Detail label="Salary" value={job.salary} />
          <Detail label="Date Posted" value={job.datePosted} />
          <Detail label="Deadline" value={job.deadline} />
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed break-words">
            {job.description}
          </p>
        </div>

        {/* Buttons */}
        {canShowButtons && (
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
  onClick={handleSave}
  className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold border transition ${
    isSaved
      ? "bg-gray-200 border-gray-300 text-gray-700"
      : "border-blue-600 text-blue-600 hover:bg-blue-50"
  }`}
>
  <Bookmark
    size={18}
    className={isSaved ? "fill-current" : ""}
  />
  {isSaved ? "Saved" : "Save Job"}
</button>

            <button
              onClick={handleApply}
              className={`flex-1 px-6 py-2 rounded-lg font-semibold text-white transition ${
                hasApplied
                  ? "bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {hasApplied ? "Applied" : "Apply Now"}
            </button>
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}
      {/* Login/Register modal */}
{modal === "login" && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl border">
      <h3 className="text-lg font-bold text-gray-900 text-center">
        You need a user account to continue
      </h3>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            setModal(null);
            navigate("/login");
          }}
          className="w-full py-2.5 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
        >
          Login
        </button>

        <button
          onClick={() => {
            setModal(null);
            navigate("/register");
          }}
          className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Register
        </button>

        <button
          onClick={() => setModal(null)}
          className="w-full py-2.5 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      {modal === "confirm" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Confirm Application
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to apply for this job?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmApply}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "success" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-green-600 text-center">
              Application submitted successfully
            </h2>

            <button
              onClick={() => setModal(null)}
              className="w-full mt-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {modal === "saveSuccess" && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"> {/* same as confirm modal */}
      <h2
        className={`text-lg font-semibold text-center ${
          isSaved ? "text-blue-600" : "text-red-600" // blue if saved, red if unsaved
        }`}
      >
        {isSaved
          ? "Job saved successfully"
          : "Job removed from saved jobs"}
      </h2>

      <button
        onClick={() => setModal(null)}
        className="w-full mt-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        OK
      </button>
    </div>
  </div>
)}
    </div>
  );
}

// ---------------- Detail Component ----------------
function Detail({ label, value }) {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}