import mongoose from "mongoose";

const connection = {}; // To store the connection status globally

export const dbConnect = async () => {
  // Check if the database is already connected
  if (connection.isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    // Connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {
      dbName: "Med+", 
      useNewUrlParser: true, // Enable the new URL parser (best practice)
      useUnifiedTopology: true, // Enable the new connection management engine
    });

    // Store the connection state globally
    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    // Improved error logging
    console.error("Error while connecting to the database:", error.message);

    // Exit process only in non-production environments
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};
