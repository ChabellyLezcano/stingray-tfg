const mongoose = require("mongoose");

// Method to connect to the MongoDB database
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.BD_CNN);

    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error initializing DB");
  }
};

module.exports = {
  dbConnection,
};
