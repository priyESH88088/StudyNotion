const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;