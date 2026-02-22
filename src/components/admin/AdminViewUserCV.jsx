import { useParams, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import CVTemplate from "../user/CVTemplate";

export default function AdminViewUserCV() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
  const user = data?.users.find(u => u.userId === userId);

  if (!user) return <p className="p-6 text-red-500">User not found</p>;

  const handleDownload = () => {
    const element = document.getElementById("cv-content");

    html2pdf()
      .set({
        margin: 0,
        filename: `${user.firstName} ${user.lastName}'s CV of Find Jobs platform.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Rounded Themed Section */}
      <div className="bg-blue-50 min-h-screen rounded-t-3xl pt-24 px-4 pb-10">
        <div className="max-w-5xl mx-auto">

          {/* Action Bar - stays single row */}
          <div className="no-print flex justify-between items-center mb-6">

            <button
              onClick={() => navigate(-1)}
              className="border border-blue-600 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
            >
              ← Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Download CV
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-100 transition"
              >
                Print
              </button>
            </div>
          </div>

          <CVTemplate user={user} />

        </div>
      </div>
    </div>
  );
}