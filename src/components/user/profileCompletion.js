export function calculateProfileCompletion(user) {
  let filled = 0;

  // ===== BASIC =====
  const baseFields = [
    "email",
    "firstName",
    "lastName",
    "phone",
    "emergencyPhone",
    "gender",
    "maritalStatus",
    "fatherName",
    "motherName",
    "currentAddress",
    "permanentAddress",
  ];

  baseFields.forEach(f => {
    if (user[f] && user[f].trim()) filled++;
  });

  // ===== EDUCATION (max 3 × 4 = 12) =====
  const edu = (user.education || []).slice(0, 3);
  edu.forEach(e => {
    ["level", "institute", "result", "year"].forEach(field => {
      if (e[field] && e[field].trim()) filled++;
    });
  });

  // ===== WORK EXPERIENCE (1 × 4) =====
  if (user.experience?.[0]) {
    ["company", "role", "duration", "skills"].forEach(field => {
      if (user.experience[0][field] && user.experience[0][field].trim()) filled++;
    });
  }

  // ===== LINKS (2 × 2) =====
  const links = (user.links || []).slice(0, 2);
  links.forEach(l => {
    ["label", "url"].forEach(field => {
      if (l[field] && l[field].trim()) filled++;
    });
  });

  const TOTAL = 11 + 12 + 4 + 4; // 31 fields

  const percent = Math.floor((filled / TOTAL) * 100 / 5) * 5;
  return Math.min(percent, 100);
}