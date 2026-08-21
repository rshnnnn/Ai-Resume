const dns = require("dns");

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);
const mongoose = require("mongoose");



async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Cannot connect to MongoDB:", error);
    }
}

module.exports = connectDB;