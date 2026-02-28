// ================= HELPER FUNCTIONS =================

const colors = [
  "#2563eb","#4f46e5","#7c3aed",
  "#059669","#0d9488","#ea580c","#dc2626"
];

const generateColorFromText = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash += text.charCodeAt(i);
  }
  return colors[hash % colors.length];
};

const randomFromArray = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const generateDigits = (length) => {
  let digits = "";
  for (let i = 0; i < length; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  return digits;
};

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;


// ================= NAME DATA =================

const maleNames = [
  "Rafi","Tanvir","Sakib","Imran","Nayeem",
  "Mehedi","Fahim","Siam","Arif","Rakib"
];

const femaleNames = [
  "Nusrat","Ayesha","Maliha","Sumaiya",
  "Farhana","Jannat","Tanjila","Sadia","Raisa"
];

const lastNames = [
  "Islam","Hossain","Rahman","Ahmed",
  "Karim","Chowdhury","Sarker","Hasan","Mahmud","Khan"
];


// ================= CAREER TITLES =================

const careerTitles = [
  "Web Developer","Frontend Developer","Backend Developer",
  "Full Stack Developer","Software Engineer","Mobile App Developer",
  "UI/UX Designer","Digital Marketing Executive","Marketing Manager",
  "Sales Executive","Sales Manager","HR Officer",
  "HR Manager","Business Development Executive",
  "Accountant","Financial Analyst","Project Manager",
  "Data Analyst","Cyber Security Specialist",
  "DevOps Engineer","QA Engineer","Customer Support Executive"
];

const careerSummaries = [
  "Highly motivated professional with strong problem-solving skills and a passion for continuous learning. Experienced in collaborating with cross-functional teams to deliver high-quality results within deadlines.",
  "Results-driven individual with hands-on experience in modern tools and technologies. Adept at managing multiple responsibilities while maintaining high standards of professionalism and efficiency.",
  "Dedicated and performance-oriented professional with proven expertise in delivering innovative solutions. Strong communication skills and a commitment to achieving organizational goals.",
  "Dynamic and detail-oriented individual with experience in fast-paced environments. Passionate about leveraging skills and knowledge to contribute effectively to company growth."
];


// ================= OTHER DATA =================

const universities = [
  "University of Dhaka","North South University",
  "BRAC University","East West University",
  "AIUB","Jahangirnagar University"
];

const locations = [
  "Banani, Dhaka","Gulshan, Dhaka",
  "Dhanmondi, Dhaka","Mirpur, Dhaka",
  "Chattogram","Sylhet","Khulna","Rajshahi"
];

const companyNames = [
  "TechNova Ltd","Digital Bangladesh IT",
  "Skyline Solutions","CodeCraft BD",
  "NextGen Software","SmartSoft Limited",
  "FutureTech BD","InnovateX","Prime Holdings",
  "Global Ventures","Bright Future Ltd"
];


// ================= PROFILE COMPLETION =================

function calculateProfileCompletion(user) {
  let filled = 0;

  const baseFields = [
    "email","firstName","lastName","phone",
    "emergencyPhone","gender","maritalStatus",
    "fatherName","motherName","currentAddress",
    "permanentAddress","careerTitle","careerSummary"
  ];

  baseFields.forEach(f => {
    if (user[f] && user[f].trim()) filled++;
  });

  const edu = (user.education || []).slice(0, 3);
  edu.forEach(e => {
    ["level","institute","result","year"].forEach(field => {
      if (e[field] && e[field].trim()) filled++;
    });
  });

  if (user.experience?.[0]) {
    ["company","role","duration","skills"].forEach(field => {
      if (user.experience[0][field] && user.experience[0][field].trim()) filled++;
    });
  }

  const links = (user.links || []).slice(0, 2);
  links.forEach(l => {
    ["label","url"].forEach(field => {
      if (l[field] && l[field].trim()) filled++;
    });
  });

  const TOTAL = 33;
  const percent = Math.floor((filled / TOTAL) * 100 / 5) * 5;
  return Math.min(percent, 100);
}


// ================= MAIN GENERATOR =================

export function generateFakeData() {

  // -------- USERS (50) --------
  const users = [];

  for (let i = 0; i < 50; i++) {

    const gender = Math.random() > 0.5 ? "Male" : "Female";
    const firstName = gender === "Male"
      ? randomFromArray(maleNames)
      : randomFromArray(femaleNames);

    const lastName = randomFromArray(lastNames);
    const initials = firstName[0] + lastName[0];

    const fatherName =
      randomFromArray(maleNames) + " " + randomFromArray(lastNames);

    const motherName =
      randomFromArray(femaleNames) + " " + randomFromArray(lastNames);

    const currentAddress = randomFromArray(locations);
    const permanentAddress =
      Math.random() > 0.5 ? currentAddress : randomFromArray(locations);

    // ----- EDUCATION (3-5) -----
    const educationLevels = ["SSC","HSC","Bachelors"];
    if (Math.random() > 0.5) educationLevels.push("Masters");
    if (Math.random() > 0.7) educationLevels.push("PhD");

    const education = educationLevels.map(level => ({
      level,
      institute: randomFromArray(universities),
      result: (2.5 + Math.random() * 2).toFixed(2),
      year: `${randomInt(2008,2016)}-${randomInt(2017,2024)}`
    }));

    // ----- EXPERIENCE (1-4) -----
    const experience = [];
    const expCount = randomInt(1,4);

    for (let j = 0; j < expCount; j++) {
      experience.push({
        company: randomFromArray(companyNames),
        role: randomFromArray(careerTitles),
        duration: `${randomInt(1,3)} years`,
        skills: "Leadership, Communication, Problem Solving"
      });
    }

    // ----- CERTIFICATES (0-2) -----
    const certificates = [];
    if (Math.random() > 0.5) {
      certificates.push({
        title: "Professional Certification",
        institute: "Udemy",
        year: randomInt(2018,2024).toString()
      });
    }

    // ----- LINKS (2-5) -----
    const links = [
      { label: "LinkedIn", url: "https://linkedin.com/in/sample" },
      { label: "GitHub", url: "https://github.com/sample" }
    ];

    const extraLinks = randomInt(0,3);
    for (let k = 0; k < extraLinks; k++) {
      links.push({
        label: "Portfolio",
        url: "https://portfolio.com/sample"
      });
    }

    const user = {
      userId: `u_${generateDigits(6)}`,
      userLogoText: initials.toUpperCase(),
      userLogoColor: generateColorFromText(initials),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}${i}@gmail.com`,
      password: "123456",
      careerTitle: randomFromArray(careerTitles),
      careerSummary: randomFromArray(careerSummaries),
      phone: `01${generateDigits(9)}`,
      emergencyPhone: `01${generateDigits(9)}`,
      gender,
      maritalStatus: Math.random() > 0.5 ? "Single" : "Married",
      fatherName,
      motherName,
      currentAddress,
      permanentAddress,
      education,
      experience,
      certificates,
      links,
      savedJobs: [],
      appliedJobs: []
    };

    user.profileCompletion = calculateProfileCompletion(user);
    users.push(user);
  }

  // -------- COMPANIES (30) --------
  const companies = [];

  for (let i = 0; i < 30; i++) {
    const name = randomFromArray(companyNames);
    companies.push({
      companyId: `c_${generateDigits(6)}`,
      brandColor: generateColorFromText(name),
      brandName: name,
      email: `info${i}@${name.replace(/\s/g,"").toLowerCase()}.com`,
      phone: `01${generateDigits(9)}`,
      address: randomFromArray(locations),
      password: "123456"
    });
  }

  // -------- JOBS (100) --------
  const jobs = [];

  for (let i = 0; i < 100; i++) {
    const company = randomFromArray(companies);

    const today = new Date();
    const deadline = new Date();
    deadline.setDate(today.getDate() + randomInt(7,30));

    jobs.push({
      id: `j_${generateDigits(10)}`,
      companyId: company.companyId,
      companyName: company.brandName,
      title: randomFromArray(careerTitles),
      level: randomFromArray(["Fresher","Entry Level","Mid Level","Senior"]),
      location: randomFromArray(locations),
      description: "We are seeking a motivated professional to join our dynamic team and contribute to our growing success.",
      vacancy: randomInt(1,5),
      experience: randomFromArray(["Fresher","1-2 years","2-4 years","5+ years"]),
      salary: String(25000 + Math.floor(Math.random() * 80000)),
      datePosted: today.toISOString().split("T")[0],
      deadline: deadline.toISOString().split("T")[0]
    });
  }

  // -------- APPLICATIONS (400) --------
  const applications = [];

  for (let i = 0; i < 400; i++) {
    const user = randomFromArray(users);
    const job = randomFromArray(jobs);

    applications.push({
      id: `a_${generateDigits(10)}`,
      jobId: job.id,
      userId: user.userId,
      status: "Applied",
      dateApplied: new Date().toISOString(),
      dateUpdated: null
    });

    user.appliedJobs.push(job.id);
  }

  return { users, companies, jobs, applications };
}