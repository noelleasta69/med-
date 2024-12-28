import { DoctorModel } from "@/models/Doctor"; // Import Doctor schema
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  console.log("Doctor signup request received");
  await dbConnect(); // Ensure database is connected

  try {
    const {
      name,
      email,
      phone,
      password,
      DOB,
      address,
      specification,
      qualification,
    } = await req.json();

    // Check if a verified doctor exists with the same email
    const existingDoctorVerifiedByEmail = await DoctorModel.findOne({
      email,
      isVerified: true,
    });

    if (existingDoctorVerifiedByEmail) {
      return NextResponse.json(
        {
          success: false, // Signup failed because email is already taken
          message: "Email is already registered",
        },
        { status: 400 }
      );
    }

    console.log("Doctor is not present and not validated by email");

    // Check if a doctor exists with the same phone number
    const existingDoctorByPhone = await DoctorModel.findOne({ phone });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification code

    if (existingDoctorByPhone) {
      if (existingDoctorByPhone.isVerified) {
        console.log("Doctor is already present and verified");
        return NextResponse.json(
          {
            success: false,
            message: "Phone number is already registered",
          },
          { status: 400 }
        );
      } else {
        console.log("Updating unverified doctor");

        // Update the unverified doctor details
        existingDoctorByPhone.password = password; // Password hashing handled in the schema
        existingDoctorByPhone.verificationCode = verifyCode;
        existingDoctorByPhone.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        ); // 1-hour expiry
        existingDoctorByPhone.address = address;
        existingDoctorByPhone.specification = specification;
        existingDoctorByPhone.qualification = qualification;
        existingDoctorByPhone.DOB = DOB;

        await existingDoctorByPhone.save(); // Save the updated doctor

        return NextResponse.json(
          {
            success: true,
            message: "Verification code sent to email",
          },
          { status: 200 }
        );
      }
    } else {
      // Create a new doctor
      console.log("Creating a new doctor");
      const expiryDate = new Date(Date.now() + 3600000); // 1-hour expiry

      const newDoctor = new DoctorModel({
        name,
        email,
        password, // Password hashing handled in the schema
        verificationCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        phone,
        DOB,
        address,
        specification,
        qualification,
        patients: [],
        Hospital: "",
      });

      await newDoctor.save(); // Save the new doctor

      // Send response after successful signup
      return NextResponse.json(
        {
          success: true,
          message:
            "Doctor signed up successfully. Verification code sent to email.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error while signing up:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during signup",
      },
      { status: 500 }
    );
  }
};
