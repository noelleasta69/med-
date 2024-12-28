import { UserModel } from "@/modles/Users";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  console.log("Request received");
  await dbConnect(); // Ensure database is connected

  try {
    const { username, email, phone, password } = await req.json();

    // Check if a verified user exists with the same username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false, // Signup failed because username is already taken
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    console.log("User is not present and not validated by username");

    // Check if a user exists with the same email
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification code

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        console.log("User is already present and verified");
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        console.log("Updating unverified user");

        // Update the unverified user details
        existingUserByEmail.password = password; // Password hashing handled in the schema
        existingUserByEmail.verificationCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1-hour expiry
        existingUserByEmail.phone = phone;

        await existingUserByEmail.save(); // Save the updated user

        return NextResponse.json(
          {
            success: true,
            message: "Verification code sent to email",
          },
          { status: 200 }
        );
      }
    } else {
      // Create a new user
      console.log("Creating a new user");
      const expiryDate = new Date(Date.now() + 3600000); // 1-hour expiry

      const newUser = new UserModel({
        name: username,
        email,
        password, // Password hashing handled in the schema
        verificationCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        phone,
        Doctors: [],
      });

      await newUser.save(); // Save the new user

      // Send response after successful signup
      return NextResponse.json(
        {
          success: true,
          message: "User signed up successfully. Verification code sent to email.",
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
