import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the User schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true, // Remove extra spaces
    },
    phone: {
      type: String,
      unique: true, // Creates a unique index
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"], // Basic validation
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    verificationCode: {
      type: String,
      default: null, // Nullable by default
    },
    email: {
      type: String,
      unique: true, // Creates a unique index
      required: [true, "Email is required"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ], // Regex for email validation
    },
    DOB: {
      type: Date, // Corrected the syntax
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      postalCode: { type: String, default: null },
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

// Export the model
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
