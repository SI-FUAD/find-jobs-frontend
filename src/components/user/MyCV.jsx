import html2pdf from "html2pdf.js";
import CVTemplate from "./CVTemplate";

function MyCV() {
  const data = JSON.parse(localStorage.getItem("Find Jobs Data"));
  const user = data?.others.find(o => o.type === "currentUser")?.data;

  if (!user) return null;

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-blue-50 pt-24 md:pt-32 px-4 md:px-12">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        My CV
      </h1>

      <div className="max-w-5xl mx-auto">

        {/* Actions */}
        <div className="no-print flex justify-end items-center gap-3 mb-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Download CV
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Print
          </button>
        </div>

        {/* CV Template */}
        <CVTemplate user={user} />
      </div>
    </div>
  );
}

export default MyCV;