// home/jobTitleUtils.js

// Grouping of related job titles
export const jobTitleGroups = {
  "Web Developer": [
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Vue Developer",
  ],
  "Software Engineer": [
    "Software Engineer",
    "Software Developer",
    "Application Developer",
    "System Engineer",
    "Java Developer",
    "C# Developer",
  ],
  "Data & Analytics": [
    "Data Analyst",
    "Data Scientist",
    "Business Analyst",
    "Machine Learning Engineer",
    "AI Engineer",
  ],
  "Mobile Developer": ["iOS Developer", "Android Developer", "Flutter Developer"],
  "Design": ["UI Designer", "UX Designer", "Product Designer", "Graphic Designer"],
  "Marketing & Sales": ["Marketing Specialist", "Sales Executive", "SEO Specialist", "Content Writer"],
  "HR & Admin": ["HR Executive", "Recruiter", "Office Administrator"],
  "Finance": ["Accountant", "Financial Analyst", "Auditor", "Controller"],
  "Customer Support": ["Customer Service", "Support Specialist", "Client Success Manager"]
};

// Function to get all similar titles for a search term
export function getSimilarTitles(searchTitle) {
  if (!searchTitle) return [];

  searchTitle = searchTitle.toLowerCase();

  for (const group in jobTitleGroups) {
    // If exact or partial match in group name
    if (group.toLowerCase().includes(searchTitle)) {
      return jobTitleGroups[group];
    }

    // If exact or partial match in any of the titles
    const found = jobTitleGroups[group].filter((title) =>
      title.toLowerCase().includes(searchTitle)
    );
    if (found.length) return found;
  }

  // fallback: just return the original search term as a single array
  return [searchTitle];
}