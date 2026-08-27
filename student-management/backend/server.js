require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PORT = 5000;

const app = express();

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());
app.use(express.json());

// ==========================
// MONGODB CONNECTION
// ==========================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// ==========================
// HOME
// ==========================

app.get("/", (req, res) => {
  res.send("Student API is running");
});

// ==========================
// GET ALL STUDENTS
// ==========================

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error getting students",
    });
  }
});

// ==========================
// ADD STUDENT
// ==========================

app.post("/api/students", async (req, res) => {
  try {
    // Find the last student
    const lastStudent = await Student.findOne().sort({
      createdAt: -1,
    });

    let number = 1;

    // Generate next student number
    if (lastStudent) {
      number =
        parseInt(
          lastStudent.studentId.replace("STU", "")
        ) + 1;
    }

    const studentId =
      "STU" + String(number).padStart(3, "0");

    // Create student
    const student = await Student.create({
      studentId: studentId,
      name: req.body.name,
      email: req.body.email,
      course: req.body.course,
    });

    res.status(201).json(student);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error adding student",
    });
  }
});

// ==========================
// UPDATE STUDENT
// ==========================

app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent =
      await Student.findByIdAndUpdate(
        req.params.id,

        {
          name: req.body.name,
          email: req.body.email,
          course: req.body.course,
        },

        {
          new: true,
        }
      );

    // Student not found
    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(updatedStudent);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error updating student",
    });
  }
});

// ==========================
// DELETE STUDENT
// ==========================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent =
      await Student.findByIdAndDelete(
        req.params.id
      );

    // Student not found
    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error deleting student",
    });
  }
});
   // ==========================
// REGISTER USER
// ==========================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "student",
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("Register Error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
}); 
    // ==========================
// LOGIN USER
// ==========================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// ==========================
// START SERVER
// ==========================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});