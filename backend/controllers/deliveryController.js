const DeliveryPerson = require("../models/DeliveryPerson");
const Transaction = require("../models/Transaction");

// @desc    Add new delivery person
const addDeliveryPerson = async (req, res) => {
  try {
    const person = await DeliveryPerson.create(req.body);
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all delivery personnel
const getDeliveryPersonnel = async (req, res) => {
  try {
    const personnel = await DeliveryPerson.find({});
    res.json(personnel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery status of an order
const updateDeliveryStatus = async (req, res) => {
  const { transactionId, status, deliveryBoyId } = req.body;
  try {
    const transaction = await Transaction.findById(transactionId);
    if (transaction) {
      transaction.deliveryStatus = status;
      if (deliveryBoyId) transaction.deliveryBoy = deliveryBoyId;
      await transaction.save();
      
      // Update delivery boy total deliveries if completed
      if (status === "Delivered" && deliveryBoyId) {
        await DeliveryPerson.findByIdAndUpdate(deliveryBoyId, { 
          $inc: { totalDeliveries: 1 },
          status: "Available"
        });
      }
      
      res.json(transaction);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addDeliveryPerson, getDeliveryPersonnel, updateDeliveryStatus };
