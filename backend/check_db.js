require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const checkAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartrice";
    await mongoose.connect(mongoURI);
    console.log(`Connected to DB: ${mongoURI}`);
    const user = await User.findOne({ email: "admin@rice.com" });
    if (user) {
      console.log("Admin User Found:");
      console.log("Name:", user.name);
      console.log("Email:", user.email);
      console.log("Role:", user.role);
    } else {
      console.log("Admin User NOT FOUND in database.");
    }
    process.exit();
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
    process.exit(1);
  }
};

checkAdmin();
