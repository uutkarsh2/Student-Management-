require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("./models/Student");
const User = require("./models/User");

const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;

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
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// ==========================
// HOME
// ==========================

app.get("/", (req, res) => {
  res.json({
    message: "Student Management API is running",
  });
});

// ======================================================
// STUDENT MANAGEMENT
// ADMIN ONLY
// ======================================================

// ==========================
// GET ALL STUDENTS
// ==========================

app.get(
  "/api/students",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const students = await Student.find().sort({
        createdAt: -1,
      });

      res.status(200).json(students);
    } catch (error) {
      console.log("Get Students Error:", error);

      res.status(500).json({
        message: "Error getting students",
      });
    }
  }
);

// ==========================
// ADD STUDENT
// CREATE STUDENT + LOGIN
// ADMIN ONLY
// ==========================

app.post(
  "/api/students",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, email, course, password } = req.body;

      // Check required fields
      if (!name || !email || !course || !password) {
        return res.status(400).json({
          message:
            "Name, email, course and password are required",
        });
      }

      // Password validation
      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Student password must be at least 6 characters",
        });
      }

      const studentEmail = email.toLowerCase().trim();

      // Check User collection
      const existingUser = await User.findOne({
        email: studentEmail,
      });

      if (existingUser) {
        return res.status(400).json({
          message: "A user with this email already exists",
        });
      }

      // Check Student collection
      const existingStudent = await Student.findOne({
        email: studentEmail,
      });

      if (existingStudent) {
        return res.status(400).json({
          message: "A student with this email already exists",
        });
      }

      // ==========================
      // GENERATE STUDENT ID
      // ==========================

      const lastStudent = await Student.findOne().sort({
        createdAt: -1,
      });

      let number = 1;

      if (lastStudent && lastStudent.studentId) {
        const lastNumber = parseInt(
          lastStudent.studentId.replace("STU", "")
        );

        if (!isNaN(lastNumber)) {
          number = lastNumber + 1;
        }
      }

      const studentId =
        "STU" + String(number).padStart(3, "0");

      // ==========================
      // HASH PASSWORD
      // ==========================

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      // ==========================
      // CREATE STUDENT
      // ==========================

      const student = await Student.create({
        studentId,
        name: name.trim(),
        email: studentEmail,
        course: course.trim(),
        accountCreated: true,
      });

      // ==========================
      // CREATE USER LOGIN ACCOUNT
      // ==========================

      const user = await User.create({
        name: name.trim(),
        email: studentEmail,
        password: hashedPassword,
        role: "student",
        studentId,
      });

      // ==========================
      // RESPONSE
      // ==========================

      res.status(201).json({
        message: "Student created successfully",

        student: {
          id: student._id,
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          course: student.course,
        },

        account: {
          id: user._id,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
        },
      });
    } catch (error) {
      console.log("Add Student Error:", error);

      res.status(500).json({
        message: "Error creating student",
      });
    }
  }
);

// ==========================
// UPDATE STUDENT
// ADMIN ONLY
// ==========================

app.put(
  "/api/students/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, email, course } = req.body;

      if (!name || !email || !course) {
        return res.status(400).json({
          message:
            "Name, email and course are required",
        });
      }

      const studentEmail = email.toLowerCase().trim();

      // Find student
      const student = await Student.findById(
        req.params.id
      );

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      // Check if another student uses the email
      const emailExists = await Student.findOne({
        email: studentEmail,
        _id: { $ne: req.params.id },
      });

      if (emailExists) {
        return res.status(400).json({
          message:
            "Another student already uses this email",
        });
      }

      // Update Student
      const updatedStudent =
        await Student.findByIdAndUpdate(
          req.params.id,
          {
            name: name.trim(),
            email: studentEmail,
            course: course.trim(),
          },
          {
            new: true,
            runValidators: true,
          }
        );

      // Update related User account
      if (student.studentId) {
        await User.findOneAndUpdate(
          {
            studentId: student.studentId,
          },
          {
            name: name.trim(),
            email: studentEmail,
          }
        );
      }

      res.status(200).json({
        message: "Student updated successfully",
        student: updatedStudent,
      });
    } catch (error) {
      console.log("Update Student Error:", error);

      res.status(500).json({
        message: "Error updating student",
      });
    }
  }
);

// ==========================
// DELETE STUDENT
// ADMIN ONLY
// ==========================

app.delete(
  "/api/students/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Find student first
      const student = await Student.findById(
        req.params.id
      );

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      // Delete Student record
      await Student.findByIdAndDelete(req.params.id);

      // Delete related login account
      await User.findOneAndDelete({
        studentId: student.studentId,
      });

      res.status(200).json({
        message:
          "Student and login account deleted successfully",
      });
    } catch (error) {
      console.log("Delete Student Error:", error);

      res.status(500).json({
        message: "Error deleting student",
      });
    }
  }
);
   // ======================================================
// STUDENT PROFILE
// STUDENT ONLY
// ======================================================

app.get(
  "/api/student/me",
  authMiddleware,
  async (req, res) => {
    try {
      // Make sure logged-in user is a student
      if (req.user.role !== "student") {
        return res.status(403).json({
          message: "Access denied. Student only.",
        });
      }

      // Make sure student ID exists in token
      if (!req.user.studentId) {
        return res.status(400).json({
          message: "Student ID not found.",
        });
      }

      // Find student using studentId
      const student = await Student.findOne({
        studentId: req.user.studentId,
      });

      if (!student) {
        return res.status(404).json({
          message: "Student record not found.",
        });
      }

      res.status(200).json({
        student: {
          id: student._id,
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          course: student.course,
        },
      });

    } catch (error) {
      console.log("Student Profile Error:", error);

      res.status(500).json({
        message: "Error getting student profile",
      });
    }
  }
);
// ======================================================
// AUTHENTICATION
// ======================================================

// ==========================
// LOGIN
// ADMIN + STUDENT
// ==========================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check fields
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Please enter email, password, and role",
      });
    }

    const userEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: userEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email, password, or role",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email, password, or role",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is missing");

      return res.status(500).json({
        message:
          "Server authentication configuration error",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        studentId: user.studentId || null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId || null,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});