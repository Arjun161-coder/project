const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/html")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Arjun@123",
  database: "freelancerhub"
});

db.connect((err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("✅ MySQL Connected");
});

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../frontend/html/index.html")));

app.get("login.html", (req, res) => res.sendFile(path.join(__dirname, "../html/index.html")));
app.get("/html/:page", (req, res) => res.sendFile(path.join(__dirname, `../frontend/html/${req.params.page}.html`)));

app.post("/api/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ msg: "All fields are required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ msg: "Database error" });
    if (results.length > 0) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, role], (err) => {
      if (err) return res.status(500).json({ msg: "Error saving user" });
      res.status(201).json({ msg: "Signup successful" });
    });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ msg: "Invalid credentials" });
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Invalid credentials" });

    res.status(200).json({
      msg: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

app.get("/api/projects", (_, res) => {
  db.query("SELECT * FROM projects", (err, results) => {
    if (err) return res.status(500).json({ msg: "Error retrieving projects" });
    res.status(200).json(results);
  });
});

app.post("/api/post-project", (req, res) => {
  const { name, description, skills, budget, clientEmail } = req.body;
  if (!name || !description || !skills || !budget || !clientEmail)
    return res.status(400).json({ msg: "All fields are required" });

  const sql = "INSERT INTO projects (name, description, skills, budget, client_email) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, description, skills, budget, clientEmail], (err) => {
    if (err) return res.status(500).json({ msg: "Error saving project" });
    res.status(201).json({ msg: "Project posted successfully" });
  });
});

app.post("/api/bid", upload.single("resume"), (req, res) => {
  const { username, email, days, bid, linkedin, github, project_id } = req.body;
  const resume = req.file ? req.file.filename : null;

  const sql = `INSERT INTO bids (username, email, resume, days, bid_amount, linkedin, github, project_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [username, email, resume, days, bid, linkedin, github, project_id], (err) => {
    if (err) return res.status(500).json({ msg: "Error submitting bid" });
    res.status(201).json({ msg: "Bid submitted successfully" });
  });
});

app.get("/api/bids/:clientEmail", (req, res) => {
  const email = req.params.clientEmail;
  const sql = `SELECT b.*, p.name AS project_name FROM bids b JOIN projects p ON b.project_id = p.id WHERE p.client_email = ?`;
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ msg: "Error fetching bids" });
    res.status(200).json(results);
  });
});

app.get("/api/freelancers/graphic-designers", (_, res) => {
  const sql = `SELECT id, name, image, rating FROM freelancers WHERE skill = 'Graphic Design' LIMIT 10`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error retrieving freelancers" });
    res.status(200).json(results);
  });
});

app.get("/api/freelancers/:id", (req, res) => {
  const freelancerId = req.params.id;
  const profileSql = "SELECT * FROM freelancers WHERE id = ?";
  const reviewsSql = "SELECT * FROM reviews WHERE freelancer_id = ?";
  const projectsSql = "SELECT * FROM projects WHERE freelancer_id = ?";

  db.query(profileSql, [freelancerId], (err, profileResult) => {
    if (err || profileResult.length === 0) return res.status(404).json({ msg: "Freelancer not found" });
    db.query(reviewsSql, [freelancerId], (err, reviews) => {
      if (err) return res.status(500).json({ msg: "Error fetching reviews" });
      db.query(projectsSql, [freelancerId], (err, projects) => {
        if (err) return res.status(500).json({ msg: "Error fetching projects" });
        res.status(200).json({
          profile: profileResult[0],
          reviews,
          projects
        });
      });
    });
  });
});

app.get("/api/user", (req, res) => {
  db.query("SELECT * FROM profile LIMIT 1", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

app.put("/api/user", (req, res) => {
  const data = req.body;
  const sql = `UPDATE profile SET 
    name = ?, email = ?, education = ?, resumeLink = ?, github = ?, linkedin = ?, 
    projects = ?, reviews = ?, hourlyRate = ?, role = ?, skills = ?, country = ?, image = ?
    WHERE id = 1`;
  const values = [
    data.name, data.email, data.education, data.resumeLink, data.github, data.linkedin,
    data.projects, data.reviews, data.hourlyRate, data.role, data.skills, data.country, data.image
  ];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
