const axios = require("axios");

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin`; // Update this if your port or base path differs

const branches = [
  "Computer Science and Engineering",
  "Information Technology",
  "Metallurgy",
  "Mechanical",
];

const subjectsByBranch = {
  "Computer Science and Engineering": [
    "Analysis and Design of Algorithms",
    "Compiler Design",
    "Principle of Programming Languages",
    "Computer Networks",
    "Computer System Architecture",
  ],
  "Information Technology": [
    "Theory of Computation",
    "Statistics and Probability",
  ],
};

async function seed() {
  try {
    for (const branch of branches) {
      const res = await axios.post(`${API_BASE}/branches`, { branchName: branch });
      console.log(`✅ Branch added: ${res.data.name}`);
    }

    for (const [branchName, subjects] of Object.entries(subjectsByBranch)) {
      for (const subjectName of subjects) {
        const res = await axios.post(`${API_BASE}/subjects`, {
          branchName,
          semesterNumber: 4,
          subjectName,
        });
        console.log(`📘 Subject added to ${branchName} Sem 4: ${subjectName}`);
      }
    }

    console.log("🎉 Seeding completed.");
  } catch (err) {
    if (err.response) {
      console.error("❌ Error:", err.response.data.message);
    } else {
      console.error("❌ Unexpected Error:", err.message);
    }
  }
}

seed();
