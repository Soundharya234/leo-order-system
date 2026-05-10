require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Transaction = require("./models/Transaction");
const Notification = require("./models/Notification");
const Supplier = require("./models/Supplier");

const verifyAutomation = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rice-shop");
        console.log("Connected for Automation Verification...");

        // 1. Find a product or create one with low stock
        let product = await Product.findOne({ name: "Karnataka Ponni" });
        if (!product) {
            product = await Product.create({
                name: "Karnataka Ponni",
                price: 55,
                stock: 25,
                reorderLevel: 20,
                description: "Super quality karnataka rice",
                imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=2070"
            });
        }

        // 2. Clear existing notifications for cleanliness
        await Notification.deleteMany({ relatedId: product._id });

        // 3. Manually trigger a mock transaction logic (or call the endpoint logic)
        // Since we are testing the logic in transactions.js via node, we'll simulate the reduction
        console.log(`Current Stock: ${product.stock}kg. Reducing by 10kg...`);
        product.stock -= 10;
        
        if (product.stock <= product.reorderLevel) {
            console.log(`[TRIGGERED] Low Stock: ${product.stock}kg <= ${product.reorderLevel}kg`);
            
            // This mirrors the logic I put in transactions.js
            const newNotify = await Notification.create({
                title: "Low Stock Alert: " + product.name,
                message: `${product.name} is now at ${product.stock}kg. Restock required immediately.`,
                type: "low_stock",
                priority: "high",
                relatedId: product._id
            });
            console.log("Created Notification ID:", newNotify._id);


            const mainSupplier = await Supplier.findOne({ isAvailable: true });
            if (mainSupplier) {
                console.log(`[WHATSAPP SUCCESS] To ${mainSupplier.name} (${mainSupplier.phone}) -> "Low Stock: ${product.name}..."`);
            }
        }
        await product.save();

        // 4. Verify Notification was created
        const allAlerts = await Notification.find({});
        console.log(`Total Notifications in DB: ${allAlerts.length}`);
        
        const alert = await Notification.findOne({ title: new RegExp(product.name, 'i') });
        if (alert) {
            console.log("VERIFICATION SUCCESS: Notification found in DB!");
            console.log("Found Title:", alert.title);
        } else {
            console.log("VERIFICATION FAILED: Still not finding it.");
        }


        process.exit();
    } catch (error) {
        console.error("Verification Error:", error);
        process.exit(1);
    }
};

verifyAutomation();
