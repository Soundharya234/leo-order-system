require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Customer = require("./models/Customer");

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartrice";
    await mongoose.connect(mongoURI);

    // Clear existing data COMPLETELY
    await User.deleteMany();
    await Product.deleteMany();
    await Customer.deleteMany();

    // 1. Create Admin (Owner)
    // IMPORTANT: Role must be 'admin' to access the Dashboard
    await User.create({
      name: "P. Leo Frankline",
      email: "admin@rice.com",
      password: "password123",
      role: "admin"
    });

    // 2. Create Products (Meesho Style)
    const products = await Product.create([
      { 
        name: "Royal Basmati Rice 5kg", 
        price: 1200, 
        stock: 200,
        description: "Aromatic extra-long grains, perfect for biryani. Aged for premium flavor.",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
        purchaseCount: 250
      },
      { 
        name: "Classic Sona Masoori 10kg", 
        price: 850, 
        stock: 45,
        description: "Lightweight and non-sticky. Ideal for daily South Indian meals.",
        imageUrl: "https://images.unsplash.com/photo-1590080873974-9a0d8a554a93?auto=format&fit=crop&q=80&w=800",
        purchaseCount: 540
      }
    ]);

    // 3. Create a Customer for Phone Login Testing
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 35);

    await Customer.create({ 
      name: "Rahul Sharma", 
      phone: "9876543210", 
      totalPurchase: 12500, 
      visitCount: 15, 
      balance: 2000, 
      creditDueDate: pastDate, 
      lastPurchaseDate: pastDate,
      lastPurchase: [
          { product: products[0]._id, name: products[0].name, quantity: 2, price: 1200 }
      ]
    });

    console.log("Database reset and seeded successfully!");
    console.log("Admin: admin@rice.com / password123 (P. Leo Frankline)");
    console.log("Customer Phone: 9876543210");
    process.exit();
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
