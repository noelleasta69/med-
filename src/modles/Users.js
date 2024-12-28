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
      type: Date,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date of birth must be in the past",
      },
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    verifyCodeExpiry: {
      type: Date
    },
    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      postalCode: { type: String, default: null },
    },
    Doctors:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: []
    }]
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields  
  }
);

UserSchema.pre("save", async function (next) {
  if(this.isModified("password")){
    const bcrypt = require("bcrypt");
    this.password = await bcrypt.hash(this.password, 10)
  }
  next();
})

// Export the model
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
