import mongoose from "mongoose";

const SpecialtySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  associated_doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    default: []
  }],
  associated_hospitals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    default: []
  }]
});

export const SpecialtyModel =
  mongoose.models.Specialty || mongoose.model("Specialty", SpecialtySchema);
