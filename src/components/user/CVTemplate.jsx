import { BiLocationPlus } from "react-icons/bi";

function CVTemplate({ user }) {
  const initials =
    user.userLogoText ||
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  return (
    <div
      id="cv-content"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        background: "white",
        padding: "30px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          gap: "25px",
          alignItems: "flex-start",
          borderBottom: "3px solid #2563eb",
          paddingBottom: "20px",
          marginBottom: "25px",
        }}
      >
        {/* Logo Circle */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            backgroundColor: user.userLogoColor || "#2563eb",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            {initials}
          </span>
        </div>

        {/* Name + Contact */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              margin: 0,
              color: "#111827",
              letterSpacing: "1px",
            }}
          >
            {user.firstName} {user.lastName}
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#2563eb",
              fontWeight: "600",
              marginTop: "5px",
            }}
          >
            {user.title || "Professional"}
          </p>

          <div
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "#4b5563",
              lineHeight: "1.6",
            }}
          >
            <div>📧 {user.email}</div>
            <div>📞 {user.phone}</div>
            {user.currentAddress && (
              <div>📍 {user.currentAddress}</div>
            )}
          </div>
        </div>
      </div>

      {/* ================= PERSONAL INFO ================= */}
      <section style={{ marginBottom: "25px" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#2563eb",
            borderLeft: "5px solid #2563eb",
            paddingLeft: "10px",
            marginBottom: "12px",
          }}
        >
          Personal Information
        </h2>

        <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
          <div><strong>Gender:</strong> {user.gender}</div>
          <div><strong>Marital Status:</strong> {user.maritalStatus}</div>
          <div><strong>Father’s Name:</strong> {user.fatherName}</div>
          <div><strong>Mother’s Name:</strong> {user.motherName}</div>
        </div>
      </section>

      {/* ================= EDUCATION ================= */}
      {user.education?.length > 0 && (
        <section style={{ marginBottom: "25px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#2563eb",
              borderLeft: "5px solid #2563eb",
              paddingLeft: "10px",
              marginBottom: "12px",
            }}
          >
            Education
          </h2>

          {user.education.map((e, i) => (
            <div
              key={i}
              style={{
                marginBottom: "15px",
                paddingBottom: "10px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontWeight: "600" }}>{e.level}</div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                {e.institute} • {e.year}
              </div>
              <div style={{ fontSize: "14px" }}>
                Result: {e.result}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {user.experience?.length > 0 && (
        <section style={{ marginBottom: "25px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#2563eb",
              borderLeft: "5px solid #2563eb",
              paddingLeft: "10px",
              marginBottom: "12px",
            }}
          >
            Work Experience
          </h2>

          {user.experience.map((ex, i) => (
            <div
              key={i}
              style={{
                marginBottom: "15px",
                paddingBottom: "10px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontWeight: "600" }}>{ex.role}</div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                {ex.company} • {ex.duration}
              </div>
              <div style={{ fontSize: "14px", marginTop: "5px" }}>
                <strong>Skills Used:</strong> {ex.skills}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ===== CERTIFICATIONS ===== */}
{user.certificates?.length > 0 && (
  <section className="mb-6">
    <h2 className="text-blue-600 font-semibold mb-4 relative pl-3">
      <span className="absolute left-0 top-1 w-1 h-full bg-blue-600 rounded"></span>
      Certifications
    </h2>

    <div className="space-y-4">
      {user.certificates.map((cert, index) => (
        <div key={index} className="pl-4">
          <p className="text-gray-900 font-semibold text-base">
            {cert.name} — {cert.organization} ({cert.year})
          </p>
        </div>
      ))}
    </div>
  </section>
)}

      {/* ================= LINKS ================= */}
      {user.links?.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#2563eb",
              borderLeft: "5px solid #2563eb",
              paddingLeft: "10px",
              marginBottom: "12px",
            }}
          >
            Links
          </h2>

          {user.links.map((l, i) => (
            <div key={i} style={{ fontSize: "14px", marginBottom: "6px" }}>
              <strong>{l.label}:</strong>{" "}
              <span style={{ color: "#2563eb" }}>{l.url}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default CVTemplate;