require("dotenv").config();
const mongoose = require("mongoose");

const dropDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartrice";
    await mongoose.connect(mongoURI);
    console.log(`Connected to DB: ${mongoURI}`);
    await mongoose.connection.db.dropDatabase();
    console.log("Database DROPPED successfully.");
    process.exit();
  } catch (error) {
    console.error("Error dropping DB:", error.message);
    process.exit(1);
  }
};

dropDB();
