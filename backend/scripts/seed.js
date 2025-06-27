const axios = require("axios");

const API_BASE = "http://localhost:8000/api/admin";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg1ZTc1MmJmOWM0M2M4Y2FhZjZkMzNjIiwiZW1haWwiOiJhcnNoaWx5dXN1ZkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiQXJzaGlsIFl1c3VmIiwiYnJhbmNoTmFtZSI6IkNvbXB1dGVyIFNjaWVuY2UgYW5kIEVuZ2luZWVyaW5nIiwieWVhck51bWJlciI6Miwic2VtZXN0ZXJOdW1iZXIiOjQsInJvbGxOdW1iZXIiOiIyMzExNTAxNSJ9LCJpYXQiOjE3NTEwMjY0NzcsImV4cCI6MTc1MTQ1ODQ3N30.z-V4C6tS31-WHmz8OtDSw4AF_P9n9jzRxgAarw3F8LA"; 

const branches = [
  "Computer Science and Engineering",
  "Information Technology",
  "Metallurgy",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics and Communication Engineering",
  "Chemical Engineering",
  "Mining Engineering",
  "Bio-Technology",
  "Biomedical Engineering",
  "Applied Geology",
  "Architecture",
];

async function seed() {
  console.log("🌐 Seeding to:", API_BASE);

  try {
    for (const branchName of branches) {
      const res = await axios.post(
        `${API_BASE}/branches`,
        { branchName },
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`✅ Branch added: ${res.data.name}`);
    }

    console.log("🎉 Branch seeding completed.");
  } catch (err) {
    if (err.response) {
      console.error("❌ Server Error:", err.response.data.message);
    } else if (err.code === "ECONNREFUSED") {
      console.error(`❌ Cannot connect to backend at ${API_BASE}`);
    } else {
      console.error("❌ Unexpected Error:", err.message);
    }
  }
}

seed();
