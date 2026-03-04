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

// Random past date within last 1 year (not future)
const randomPastDateWithinYear = () => {
  const today = new Date();
  const past = new Date();
  past.setFullYear(today.getFullYear() - 1);
  const randomTime = randomInt(past.getTime(), today.getTime());
  return new Date(randomTime);
};

const generateDeadline = (postedDate) => {
  const posted = new Date(postedDate);
  const today = new Date();

  // 50% chance active, 50% expired
  const isActive = Math.random() < 0.5;

  if (isActive) {
    // ACTIVE → future from today (max 3 months ahead)
    const minTime = today.getTime() + 1;

    const maxFuture = new Date();
    maxFuture.setMonth(today.getMonth() + 3);
    const maxTime = maxFuture.getTime();

    const randomTime = randomInt(minTime, maxTime);
    return new Date(randomTime);

  } else {
    // EXPIRED → past but not before posted date
    const minTime = posted.getTime();
    const maxTime = today.getTime() - 1;

    // If posted date is today, force active
    if (minTime >= maxTime) {
      const future = new Date();
      future.setMonth(today.getMonth() + 1);
      return future;
    }

    const randomTime = randomInt(minTime, maxTime);
    return new Date(randomTime);
  }
};

// Generate application date AFTER job post date and NOT future
const generateApplicationDate = (postedDate) => {
  const today = new Date();
  const min = new Date(postedDate);
  const max = today;
  const randomTime = randomInt(min.getTime(), max.getTime());
  return new Date(randomTime);
};

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

const careerSummaryText = `
Results-driven professional with hands-on experience in modern technologies and industry best practices. Demonstrates strong analytical thinking, problem-solving abilities, and effective communication skills in cross-functional team environments. Proven ability to manage multiple responsibilities, meet deadlines, and deliver high-quality outcomes under pressure. Passionate about continuous learning, adapting to emerging trends, and contributing meaningfully to organizational growth through innovation, collaboration, and strategic execution.
`;

// ================= OTHER DATA =================

const schools = [
  "Dhaka Residential Model School",
  "Ideal School and College",
  "Viqarunnisa Noon School",
  "Rajuk Uttara Model College",
  "Scholastica School",
  "Chittagong Collegiate School"
];

const universities = [
  "University of Dhaka","North South University",
  "BRAC University","East West University",
  "AIUB","Jahangirnagar University"
];

const locations = [
  "Banani, Dhaka","Gulshan, Dhaka","Dhanmondi, Dhaka",
  "Mirpur, Dhaka","Chattogram","Sylhet","Khulna","Rajshahi"
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

    const educationLevels = ["SSC","HSC","Bachelors"];
    if (Math.random() > 0.5) educationLevels.push("Masters");
    if (Math.random() > 0.7) educationLevels.push("PhD");

    const education = educationLevels.map(level => ({
      level,
      institute:
        level === "SSC" || level === "HSC"
          ? randomFromArray(schools)
          : randomFromArray(universities),
      result: (2.5 + Math.random() * 2).toFixed(2),
      year: `${randomInt(2008,2016)}-${randomInt(2017,2024)}`
    }));

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

    const certificates = [];
    if (Math.random() > 0.5) {
      certificates.push({
        name: "Professional Certification",
        organization: "Udemy",
        year: randomInt(2018,2024).toString()
      });
    }

    const links = [
      { label: "LinkedIn", url: "https://linkedin.com/in/sample" },
      { label: "GitHub", url: "https://github.com/sample" }
    ];

    const user = {
      userId: `u_${generateDigits(6)}`,
      userLogoText: initials.toUpperCase(),
      userLogoColor: generateColorFromText(initials),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}${i}@gmail.com`,
      password: "123456",
      careerTitle: randomFromArray(careerTitles),
      careerSummary: careerSummaryText,
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

  const jobs = [];

  for (let i = 0; i < 100; i++) {
    const company = randomFromArray(companies);

    const postedDateObj = randomPastDateWithinYear();
    const deadlineObj = generateDeadline(postedDateObj);

    jobs.push({
      id: `j_${generateDigits(10)}`,
      companyId: company.companyId,
      companyName: company.brandName,
      title: randomFromArray(careerTitles),
      level: randomFromArray(["Fresher","Entry Level","Mid Level","Senior"]),
      location: randomFromArray(locations),
      description: `We are looking for a dedicated professional to join our dynamic team. The ideal candidate will have a strong work ethic, excellent communication skills, and a passion for delivering high-quality results. You will be responsible for collaborating with cross-functional teams, managing projects from inception to completion, and continuously seeking opportunities to improve processes and drive innovation. This role offers the chance to grow professionally while contributing to meaningful projects that impact our organization and clients positively.`,
      vacancy: randomInt(1,5),
      experience: randomFromArray(["Fresher","1-2 years","2-4 years","5+ years"]),
      salary: Math.random() > 0.5
        ? "Negotiable"
        : String(25000 + Math.floor(Math.random() * 80000)),
      datePosted: postedDateObj.toISOString().split("T")[0],
      deadline: deadlineObj.toISOString().split("T")[0]
    });
  }

  const applications = [];
  const statusOptions = ["Applied", "Shortlisted", "Accepted", "Rejected"];

  for (let i = 0; i < 400; i++) {
    const user = randomFromArray(users);
    const job = randomFromArray(jobs);

    const appliedDateObj = generateApplicationDate(job.datePosted);

    const status = randomFromArray(statusOptions);

    let dateUpdated = null;
    if (status !== "Applied") {
      const minDate = new Date(job.datePosted).getTime();
      const maxDate = new Date().getTime();
      const randomTime = randomInt(minDate, maxDate);
      dateUpdated = new Date(randomTime).toISOString();
    }

    applications.push({
      id: `a_${generateDigits(10)}`,
      jobId: job.id,
      userId: user.userId,
      status,
      dateApplied: appliedDateObj.toISOString(),
      dateUpdated
    });

    user.appliedJobs.push(job.id);
  }

  return { users, companies, jobs, applications };
}