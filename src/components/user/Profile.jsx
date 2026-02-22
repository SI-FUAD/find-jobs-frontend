import { useState } from "react";
import { calculateProfileCompletion } from "./profileCompletion";

export default function Profile() {
  const stored =
    JSON.parse(localStorage.getItem("Find Jobs Data")) || {
      users: [],
      others: [],
    };

  const currentUser =
    stored.others.find(o => o.type === "currentUser")?.data || null;

  const userIndex = stored.users.findIndex(
    u => u.userId === currentUser?.userId
  );

  /* ================= STATES ================= */

  const [editMode, setEditMode] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);

  const [form, setForm] = useState(() => {
  const user = stored.users[userIndex] || {};

  // Calculate profile completion for this user
  const completion = calculateProfileCompletion(user);

  // Also update localStorage once safely
  const freshData = JSON.parse(localStorage.getItem("Find Jobs Data")) || { users: [], others: [] };

  const usersCopy = [...freshData.users];
  usersCopy[userIndex] = { ...user, profileCompletion: completion };

  const othersCopy = freshData.others.map(o =>
    o.type === "currentUser" ? { ...o, data: { ...user, profileCompletion: completion } } : o
  );

  localStorage.setItem(
    "Find Jobs Data",
    JSON.stringify({ ...freshData, users: usersCopy, others: othersCopy })
  );

  return {
    ...user,
    careerTitle: user.careerTitle || "",
    careerSummary: user.careerSummary || "",
    phone: user.phone || "",
    emergencyPhone: user.emergencyPhone || "",
    gender: user.gender || "",
    maritalStatus: user.maritalStatus || "",
    fatherName: user.fatherName || "",
    motherName: user.motherName || "",
    currentAddress: user.currentAddress || "",
    permanentAddress: user.permanentAddress || "",
    education: user.education || [],
    experience: user.experience || [],
    certificates: user.certificates || [],
    links: user.links || [],
    savedJobs: user.savedJobs || [],
    profileCompletion: completion,
  };
});

const handleChange = e => {
  const { name, value } = e.target;

  setForm(prev => {
    const updated = { ...prev, [name]: value };

    // If current address changes & checkbox is on → sync permanent
    if (name === "currentAddress" && sameAddress) {
      updated.permanentAddress = value;
    }

    return updated;
  });
};

  /* ================= GUARD ================= */

  if (!currentUser || userIndex === -1) {
    return <p className="p-6 text-red-500">Unauthorized</p>;
  }

  /* ================= HELPERS ================= */

  const handleArrayChange = (key, index, field, value) => {
    setForm(prev => {
      const updated = [...prev[key]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [key]: updated };
    });
  };

  const addItem = (key, template) => {
    setForm(prev => ({
      ...prev,
      [key]: [...prev[key], template],
    }));
  };

  const removeItem = (key, index) => {
    setForm(prev => {
      const updated = [...prev[key]];
      updated.splice(index, 1);
      return { ...prev, [key]: updated };
    });
  };

  /* ================= VALIDATION ================= */

  const validateArraySection = (items, fields, sectionName) => {
    for (let item of items) {
      for (let field of fields) {
        if (!item[field] || item[field].trim() === "") {
          alert(`Please complete all fields in ${sectionName}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!form.careerTitle.trim() || !form.careerSummary.trim()) {
      alert("Please complete Career Title and Career Summary");
      return;
    }

  if (
    !validateArraySection(form.education, ["level", "institute", "result", "year"], "Education") ||
    !validateArraySection(form.experience, ["company", "role", "duration", "skills"], "Work Experience") ||
    !validateArraySection(form.certificates, ["name", "organization", "year"], "Certificates") ||
    !validateArraySection(form.links, ["label", "url"], "Links")
  ) {
    return;
  }

  // Calculate profile completion
  const completion = calculateProfileCompletion(form);

  // Update localStorage
  const freshData =
    JSON.parse(localStorage.getItem("Find Jobs Data")) || { users: [], others: [] };

  const usersCopy = [...freshData.users];
  usersCopy[userIndex] = { ...form, profileCompletion: completion };

  const othersCopy = freshData.others.map(o =>
    o.type === "currentUser"
      ? { ...o, data: { ...form, profileCompletion: completion } }
      : o
  );

  localStorage.setItem(
    "Find Jobs Data",
    JSON.stringify({ ...freshData, users: usersCopy, others: othersCopy })
  );

  // Update form state with new profileCompletion
  setForm(prev => ({ ...prev, profileCompletion: completion }));

  // Disable edit mode
  setEditMode(false);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-blue-50 pt-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 space-y-8">

        {/* ===== Profile Header ===== */}
<div className="flex justify-between items-center mb-6">

  {/* Left: Profile Logo */}
  <div className="flex items-center gap-3">
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
      style={{ backgroundColor: form.userLogoColor }}
    >
      {form.userLogoText}
    </div>
    <div>
      <p className="font-semibold">
        {form.firstName} {form.lastName}
      </p>
      <p className="text-sm text-gray-500">User Profile</p>
    </div>
  </div>

  {/* Right: Completion + Edit */}
  <div className="flex items-center gap-4 justify-end">
  <div className="relative w-16 h-16">
    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
      <circle
        className="text-gray-300"
        strokeWidth="4"
        stroke="currentColor"
        fill="none"
        cx="18"
        cy="18"
        r="16"
      />
      <circle
        className="text-blue-600"
        strokeWidth="4"
        strokeLinecap="round"
        stroke="currentColor"
        fill="none"
        cx="18"
        cy="18"
        r="16"
        strokeDasharray="100, 100"
        strokeDashoffset={`${100 - (form.profileCompletion || 0)} `}
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-blue-600">
      {form.profileCompletion || 0}%
    </div>
  </div>

  <button
    onClick={() => setEditMode(v => !v)}
    className={`px-5 py-2 rounded-lg font-semibold transition ${
      editMode
        ? "bg-red-500 text-white hover:bg-red-600"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
  >
    {editMode ? "Cancel" : "Edit"}
  </button>
</div>
</div>

        {/* Basic Info */}
        <Section title="Basic Information">
          <Grid>
            <ReadOnly label="User ID" value={form.userId} />
            <ReadOnly label="Email" value={form.email} />

            <Input label="First Name" disabled={!editMode} name="firstName" value={form.firstName} onChange={handleChange} />
            <Input label="Last Name" disabled={!editMode} name="lastName" value={form.lastName} onChange={handleChange} />
            <Input label="Phone" disabled={!editMode} name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Emergency Phone" disabled={!editMode} name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} />

            <Select
            disabled={!editMode}
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
            />

            <Select
            disabled={!editMode}
              label="Marital Status"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              options={["Single", "Married"]}
            />

            <Input label="Father's Name" disabled={!editMode} name="fatherName" value={form.fatherName} onChange={handleChange} />
            <Input label="Mother's Name" disabled={!editMode} name="motherName" value={form.motherName} onChange={handleChange} />
          </Grid>
        </Section>

        {/* Address */}
        <Section title="Address">
          <Grid>
            <Textarea label="Current Address" disabled={!editMode} name="currentAddress" value={form.currentAddress} onChange={handleChange} />
            <Textarea
  label="Permanent Address"
  name="permanentAddress"
  value={form.permanentAddress}
  onChange={handleChange}
  disabled={!editMode || sameAddress}
  className={`w-full border rounded-lg p-2 mt-1 ${
    sameAddress ? "bg-gray-100 cursor-not-allowed" : ""
  }`}
/>

          </Grid>

          <label className="flex items-center gap-2 text-sm mt-3">
  <input
    type="checkbox"
    checked={sameAddress}
    disabled={!editMode}
    onChange={e => {
      const checked = e.target.checked;
      setSameAddress(checked);

      if (checked) {
        setForm(prev => ({
          ...prev,
          permanentAddress: prev.currentAddress,
        }));
      }
    }}
  />
  Make current address same as permanent address
</label>

        </Section>

        {/* Career Information */}
<Section title="Career Information">
  <div className="space-y-4">

    {/* Title (half width like normal input) */}
    <div className="md:w-1/2">
      <Input
        label="Professional Title"
        name="careerTitle"
        value={form.careerTitle}
        onChange={handleChange}
        disabled={!editMode}
      />
    </div>

    {/* Summary (full width large field) */}
    <div>
      <label className="text-sm text-gray-500">Career Summary</label>
      <textarea
        name="careerSummary"
        value={form.careerSummary}
        onChange={handleChange}
        disabled={!editMode}
        rows="5"
        className="w-full border rounded-lg p-3 mt-1"
      />
    </div>

  </div>
</Section>

        {/* Education */}
        <ArraySection
          title="Education"
          items={form.education}
          onAdd={() =>
            addItem("education", { level: "", institute: "", result: "", year: "" })
          }
          onRemove={i => removeItem("education", i)}
          disabled={!editMode}
        >
          {(item, i) => (
            <Grid key={i}>
              <Input label="Level" disabled={!editMode} value={item.level} onChange={e => handleArrayChange("education", i, "level", e.target.value)} />
              <Input label="Institute" disabled={!editMode} value={item.institute} onChange={e => handleArrayChange("education", i, "institute", e.target.value)} />
              <Input label="Result" disabled={!editMode} value={item.result} onChange={e => handleArrayChange("education", i, "result", e.target.value)} />
              <Input label="Year" disabled={!editMode} value={item.year} onChange={e => handleArrayChange("education", i, "year", e.target.value)} />
            </Grid>
          )}
        </ArraySection>

        {/* Experience */}
        <ArraySection
          title="Work Experience"
          items={form.experience}
          onAdd={() =>
            addItem("experience", { company: "", role: "", duration: "", skills: "" })
          }
          onRemove={i => removeItem("experience", i)}
          disabled={!editMode}
        >
          {(item, i) => (
            <Grid key={i}>
              <Input label="Company" disabled={!editMode} value={item.company} onChange={e => handleArrayChange("experience", i, "company", e.target.value)} />
              <Input label="Role" disabled={!editMode} value={item.role} onChange={e => handleArrayChange("experience", i, "role", e.target.value)} />
              <Input label="Duration" disabled={!editMode} value={item.duration} onChange={e => handleArrayChange("experience", i, "duration", e.target.value)} />
              <Input label="Skills Learned" disabled={!editMode} value={item.skills} onChange={e => handleArrayChange("experience", i, "skills", e.target.value)} />
            </Grid>
          )}
        </ArraySection>

        {/* Certificates */}
        <ArraySection
          title="Certificates"
          items={form.certificates}
          onAdd={() =>
            addItem("certificates", { name: "", organization: "", year: "" })
          }
          onRemove={i => removeItem("certificates", i)}
          disabled={!editMode}
        >
          {(item, i) => (
            <Grid key={i}>
              <Input label="Certificate Name" disabled={!editMode} value={item.name} onChange={e => handleArrayChange("certificates", i, "name", e.target.value)} />
              <Input label="Organization" disabled={!editMode} value={item.organization} onChange={e => handleArrayChange("certificates", i, "organization", e.target.value)} />
              <Input label="Year" disabled={!editMode} value={item.year} onChange={e => handleArrayChange("certificates", i, "year", e.target.value)} />
            </Grid>
          )}
        </ArraySection>

        {/* Links */}
        <ArraySection
          title="Links"
          items={form.links}
          onAdd={() =>
            addItem("links", { label: "", url: "" })
          }
          onRemove={i => removeItem("links", i)}
          disabled={!editMode}
        >
          {(item, i) => (
            <Grid key={i}>
              <Input label="Platform" disabled={!editMode} value={item.label} onChange={e => handleArrayChange("links", i, "label", e.target.value)} />
              <Input label="URL" disabled={!editMode} value={item.url} onChange={e => handleArrayChange("links", i, "url", e.target.value)} />
            </Grid>
          )}
        </ArraySection>

        {editMode && (
  <button
    onClick={handleSave}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
  >
    Save Profile
  </button>
)}

      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input {...props} className="w-full border rounded-lg p-2 mt-1" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <textarea {...props} rows="3" className="w-full border rounded-lg p-2 mt-1" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <select {...props} className="w-full border rounded-lg p-2 mt-1">
        <option value="">Select</option>
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="bg-gray-100 p-2 rounded-lg mt-1">{value}</div>
    </div>
  );
}

function ArraySection({ title, items, onAdd, onRemove, children, disabled }) {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          {children(item, index)}
          <button
            onClick={() => onRemove(index)}
            disabled={disabled}
            className={`text-red-600 text-sm font-semibold ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        disabled={disabled}
        className={`text-blue-600 font-semibold ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        + Add {title}
      </button>
    </Section>
  );
}