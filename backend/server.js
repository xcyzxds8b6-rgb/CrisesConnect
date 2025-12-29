const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Create / connect SQLite database
const db = new sqlite3.Database("crisesconnect.db");

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS volunteers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      mobile TEXT,
      aadhar TEXT,
      skill TEXT,
      location TEXT,
      availability TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      priority TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS emergency_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      is_active INTEGER
    )
  `);

  // Default emergency state = OFF
  db.run(`
    INSERT OR IGNORE INTO emergency_state (id, is_active)
    VALUES (1, 0)
  `);
});

/* ------------------ APIs ------------------ */

// Register volunteer
app.post("/volunteers", (req, res) => {
  const { name, mobile, aadhar, skill, location, availability } = req.body;

  db.run(
    `INSERT INTO volunteers (name, mobile, aadhar, skill, location, availability)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, mobile, aadhar, skill, location, availability],
    () => res.json({ success: true })
  );
});

// Get all volunteers
app.get("/volunteers", (req, res) => {
  db.all("SELECT * FROM volunteers", (err, rows) => {
    res.json(rows);
  });
});

// Add task
app.post("/tasks", (req, res) => {
  const { description, priority } = req.body;

  db.run(
    "INSERT INTO tasks (description, priority) VALUES (?, ?)",
    [description, priority],
    () => res.json({ success: true })
  );
});

// Get all tasks
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    res.json(rows);
  });
});

// Toggle emergency
app.post("/emergency", (req, res) => {
  db.run(
    "UPDATE emergency_state SET is_active = is_active ^ 1 WHERE id = 1",
    () => res.json({ success: true })
  );
});

// Get emergency status
app.get("/emergency", (req, res) => {
  db.get(
    "SELECT is_active FROM emergency_state WHERE id = 1",
    (err, row) => res.json(row)
  );
});

// Start server
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
