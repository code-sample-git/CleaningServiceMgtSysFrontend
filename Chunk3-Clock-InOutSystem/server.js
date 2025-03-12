const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve frontend pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/tasks", (req, res) => res.sendFile(path.join(__dirname, "public", "tasks.html")));
app.get("/supplies", (req, res) => res.sendFile(path.join(__dirname, "public", "supplies.html")));

// Start server
app.listen(PORT, () => console.log(`Frontend server running at http://localhost:${PORT}`));

