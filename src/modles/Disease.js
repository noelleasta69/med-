import mongoose from "mongoose";
// import { unique } from "next/dist/build/utils";

const DiseaseSchema = new Schema({
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
  symptoms: [
    {
      type: String,
      trim: true,
    },
  ],
  associated_doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: [],
    },
  ],
  associated_hospitals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: [],
    },
  ],
});

export const DiseaseModel =
  mongoose.models.Disease || mongoose.model("Disease", DiseaseSchema);
