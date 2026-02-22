import { useState } from "react";
import {
  FaUsers,
  FaBriefcase,
  FaMoneyBillAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job, currentUser, data, setData, onUnsave }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null); // "saveSuccess", "confirmApply", "success", "login"
  const [lastSaveAction, setLastSaveAction] = useState(null);
  const company = data.companies?.find((c) => c.companyId === job.companyId);
  const brandColor = company?.brandColor || "#F97316";

  const isAdmin = currentUser?.email === "admin@findjobs.com";
  const isCompany = !!currentUser?.companyId;
  const isUser = currentUser && !isAdmin && !isCompany;
  const isLoggedOut = !currentUser;

  // ✅ Local states so UI updates immediately
  const [isSaved, setIsSaved] = useState(
    isUser && currentUser?.savedJobs?.includes(job.id)
  );

  const [hasApplied, setHasApplied] = useState(
    isUser &&
      data.applications?.some(
        (app) => app.jobId === job.id && app.userId === currentUser?.userId
      )
  );

  const showButtons = isLoggedOut || isUser;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // ---------------- SAVE FUNCTION ----------------
  const handleSave = (e) => {
    e.stopPropagation();
    if (isLoggedOut) {
      setModal("login");
      return;
    }
    if (!isUser) return;

    const usersCopy = [...data.users];
    const index = usersCopy.findIndex((u) => u.userId === currentUser.userId);
    if (index === -1) return;

    let saved = usersCopy[index].savedJobs || [];

    const actionWasSave = !saved.includes(job.id);

    if (saved.includes(job.id)) {
      saved = saved.filter((id) => id !== job.id);
    } else {
      saved.push(job.id);
    }

    usersCopy[index].savedJobs = saved;

    const othersCopy = data.others.map((o) =>
      o.type === "currentUser" ? { ...o, data: usersCopy[index] } : o
    );

    const updatedData = { ...data, users: usersCopy, others: othersCopy };
    localStorage.setItem("Find Jobs Data", JSON.stringify(updatedData));
    setData(updatedData);

    setIsSaved(actionWasSave); // ✅ update button immediately
    setLastSaveAction(actionWasSave ? "saved" : "removed");
    if (!actionWasSave && onUnsave) {
  onUnsave();
} else {
  setModal("saveSuccess");
}};

  // ---------------- APPLY FUNCTION ----------------
  const generateApplicationId = () => {
    let id;
    do {
      let digits = "";
      for (let i = 0; i < 10; i++) {
        digits += Math.floor(Math.random() * 10);
      }
      id = `a_${digits}`;
    } while (data.applications?.some((app) => app.id === id));
    return id;
  };

  const handleApply = (e) => {
    e.stopPropagation();
    if (isLoggedOut) {
      setModal("login");
      return;
    }
    if (!isUser) return;

    if (hasApplied) {
      alert("You have already applied for this job."); // ✅ same as JobView
      return;
    }

    setModal("confirmApply");
  };

  const confirmApply = () => {
    const newApp = {
      id: generateApplicationId(),
      jobId: job.id,
      userId: currentUser.userId,
      status: "Applied",
      dateApplied: new Date().toISOString(),
      dateUpdated: null,
    };

    const updatedApplications = [...(data.applications || []), newApp];

    // Update appliedJobs in currentUser
    const updatedUser = {
      ...currentUser,
      appliedJobs: [...(currentUser.appliedJobs || []), job.id],
    };

    const updatedData = {
      ...data,
      applications: updatedApplications,
      others: data.others.map((o) =>
        o.type === "currentUser" ? { ...o, data: updatedUser } : o
      ),
    };

    localStorage.setItem("Find Jobs Data", JSON.stringify(updatedData));
    setData(updatedData);

    setHasApplied(true); // ✅ update button immediately
    setModal("success");
  };

  return (
    <>
      <div
        onClick={() => navigate(`/jobs/${job.id}`)}
        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
      >
        {/* CONTENT */}
        <div className="space-y-4">
          <div
            className="inline-block px-4 py-2 text-white font-semibold text-sm tracking-wide rounded-md"
            style={{ backgroundColor: brandColor }}
          >
            {job.companyName}
          </div>

          <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>

          {job.location && (
            <p className="flex items-center gap-2 text-gray-600 text-sm">
              <FaMapMarkerAlt /> {job.location}
            </p>
          )}

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[72px]">
            {job.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700 text-sm pt-3 border-t">
            <p className="flex items-center gap-2">
              <FaUsers /> Vacancy: {job.vacancy}
            </p>
            <p className="flex items-center gap-2">
              <FaBriefcase /> Experience: {job.experience}
            </p>
            <p className="flex items-center gap-2">
              <FaMoneyBillAlt /> Salary: {job.salary || "Negotiable"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm py-4 border-t">
            <p className="flex items-center gap-2">
              <FaCalendarAlt /> Posted: {formatDate(job.datePosted)}
            </p>
            <p className="flex items-center gap-2 text-red-600 font-semibold">
              <FaCalendarAlt /> Deadline: {formatDate(job.deadline)}
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        {showButtons && (
          <div
            className="flex gap-3 pt-4 border-t mt-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
  onClick={handleSave}
  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border transition ${
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
              className={`flex-1 py-2.5 rounded-lg font-semibold text-white transition ${
                hasApplied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
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

      {/* Save/Unsave modal */}
      {modal === "saveSuccess" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2
              className={`text-lg font-semibold text-center ${
                lastSaveAction === "saved" ? "text-blue-600" : "text-red-600"
              }`}
            >
              {lastSaveAction === "saved"
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

      {/* Apply confirmation modal */}
      {modal === "confirmApply" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 text-left">
              Confirm Application
            </h2>
            <p className="text-gray-600 mb-6 text-left">
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

      {/* Apply success modal */}
      {modal === "success" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
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
    </>
  );
}