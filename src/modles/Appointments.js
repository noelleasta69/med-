import mongoose from "mongoose";


const AppointmentSchema = new Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: [true, "Doctor is required"]
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Patient is required"]
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: [true, "Hospital is required"]
    },
    date: {
        type: Date,
        required: [true, "Please select a date for appointment"]
    },
    time:{
        type: String,
        required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "canceled"],
      default: "pending",
    },
    prescription: {
      type: String,
      default: "",
    },
    disease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disease",
      required: [true, "Disease is required"],
    },
    fees: {
        type: Number,
        required: [true, "Please enter a fees"]
    }
    },
    { timestamps: true,}
);

export const AppointmentModel = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)
    







