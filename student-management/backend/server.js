require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const PORT = 5000;
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
let students = [];

// Home
app.get("/", (req, res) => {
  res.send("Student API is running");
});

// Get all students
app.get("/api/students", (req, res) => {
  res.json(students);
});

// Add student
app.post("/api/students", (req, res) => {
  const student = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    course: req.body.course,
  };

  students.push(student);

  res.status(201).json(student);
});

// Delete student
app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  students = students.filter((student) => student.id !== id);

  res.json({
    message: "Student deleted successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});