import mongoose from "mongoose";
const { Schema } = mongoose;

const DoctorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true, // Removes extra spaces
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
      ],
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
    address: {
      street: { type: String, default: "", trim: true },
      city: { type: String, default: "", trim: true },
      state: { type: String, default: "", trim: true },
      postalCode: { type: String, default: "", trim: true },
    },
    speciality: {
      type: [mongoose.Schema.Types.ObjectId], 
      ref: "Specialty",
      required: [true, "Please select your speciality"],
    },    
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
      trim: true,
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        default: [],
      },
    ],
    Hospital:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        default: ""
    }
  },
  {
    timestamps: true, 
  }
);

// Hash password before saving
DoctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const bcrypt = require("bcrypt");
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const DoctorModel =
  mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
