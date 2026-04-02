const mongoose = require('mongoose');

const ConnectDatabase = async (connection_url) => {
  try {
    await mongoose.connect(connection_url);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // stop app if DB fails
  }
};

module.exports = { ConnectDatabase };