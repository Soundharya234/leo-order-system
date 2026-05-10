require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/suppliers", require("./routes/suppliers"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/ml", require("./routes/ml"));
app.use("/api/customer", require("./routes/customerPortal"));
app.use("/api/procurement", require("./routes/procurement"));
app.use("/api/delivery", require("./routes/delivery"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/orders", require("./routes/orders"));





app.get("/", (req, res) => res.send("Smart Rice Retail Shop API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
