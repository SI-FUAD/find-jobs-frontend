export const generateCompanyId = (companies) => {
  let id;
  do {
    id = "c_" + Math.floor(100000 + Math.random() * 900000);
  } while (companies.some(c => c.companyId === id));
  return id;
};

export const generateColorFromText = (text) => {
  const colors = [
    "#2563eb", // blue
    "#4f46e5", // indigo
    "#7c3aed", // purple
    "#059669", // green
    "#0d9488", // teal
    "#ea580c", // orange
    "#dc2626", // red
  ];

  let hash = 0;
  for (let i = 0; i < text.length; i++) hash += text.charCodeAt(i);

  return colors[hash % colors.length];
};

// Initialize LocalStorage if missing
export const initializeData = () => {
  const existing = localStorage.getItem("Find Jobs Data");
  if (!existing) {
    const initData = {
      users: [],
      companies: [],
      others: [{ type: "currentUser", data: null }],
    };
    localStorage.setItem("Find Jobs Data", JSON.stringify(initData));
  }
};