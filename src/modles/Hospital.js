import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Hospital schema
const HospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    address: {
      street: { type: String, required: [true, "Street address is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      postalCode: { type: String, required: [true, "Postal code is required"] },
      country: { type: String, required: [true, "Country is required"] },
    },
    facilities: [
      {
        type: String,
        required: [true, "Facility name is required"],
      },
    ],
    specializations: [
      {
        type: String,
        required: [true, "Specialization is required"],
      },
    ],
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor", // Reference to the Doctor model
        default: [],
      },
    ],
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Ensures the email is unique across hospitals
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        "Please provide a valid website URL",
      ],
      default: null, // Nullable by default
    },
    isActive: {
      type: Boolean,
      default: true, // Indicates whether the hospital is currently active
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

// Export the model
export const HospitalModel =
  mongoose.models.Hospital || mongoose.model("Hospital", HospitalSchema);
