require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const name = "System Admin";
    const email = "admin@gmail.com";
    const password = "Admin@123";

    const existingAdmin = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      studentId: null,
    });

    console.log("================================");
    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Role:", admin.role);
    console.log("================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.log("Error creating admin:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

createAdmin();