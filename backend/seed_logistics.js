require("dotenv").config();
const mongoose = require("mongoose");
const Supplier = require("./models/Supplier");
const DeliveryPerson = require("./models/DeliveryPerson");
const Product = require("./models/Product");

const seedLogistics = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rice-shop");
    console.log("Connected for Logistics Seeding...");

    // 1. Seed Inward Suppliers (Mills/Mandis)
    await Supplier.deleteMany();
    const suppliers = await Supplier.insertMany([
      { 
        name: "Karnataka Rice Mill", 
        mandiName: "Sri Rama Rice Mill", 
        location: "Karnataka", 
        phone: "9123456780", 
        distanceInKm: 350, 
        totalOwed: 45000,
        isAvailable: true 
      },
      { 
        name: "Mannachanallur Miller", 
        mandiName: "Ponni Flour Mills", 
        location: "Mannachanallur", 
        phone: "9123456781", 
        distanceInKm: 15, 
        totalOwed: 12000,
        isAvailable: true 
      },
      { 
        name: "Thanjavur Mandi", 
        mandiName: "Cauvery Grains", 
        location: "Thanjavur", 
        phone: "9123456782", 
        distanceInKm: 55, 
        totalOwed: 0,
        isAvailable: true 
      },
      { 
        name: "Andhra Special Seeds", 
        mandiName: "Nellore Traders", 
        location: "Nellore", 
        phone: "9123456783", 
        distanceInKm: 420, 
        totalOwed: 85000,
        isAvailable: true 
      },
      { 
        name: "Local Farmer Mandi", 
        mandiName: "Uzhavar Sandhai", 
        location: "Local", 
        phone: "9123456784", 
        distanceInKm: 5, 
        totalOwed: 2500,
        isAvailable: true 
      }
    ]);

    // 2. Seed Delivery Boys (Staff)
    await DeliveryPerson.deleteMany();
    await DeliveryPerson.insertMany([
      { name: "Arul Kumar", phone: "8123456780", status: "Available", totalDeliveries: 45, rating: 4.8 },
      { name: "Muthu Selvam", phone: "8123456781", status: "Out for Delivery", totalDeliveries: 124, rating: 4.9 },
      { name: "Vijay Mani", phone: "8123456782", status: "Available", totalDeliveries: 89, rating: 4.7 }
    ]);

    // 3. Update some product reorder levels
    await Product.updateMany({}, { reorderLevel: 25 });

    console.log("Logistics Seeding Completed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedLogistics();
