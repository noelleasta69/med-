import { DoctorModel } from "@/models/Doctor"; // Model for Doctors
import { SpecialityModel } from "@/models/Speciality"; // Model for Specialities
import { DiseaseModel } from "@/models/Disease"; // Model for Diseases
import { SymptomModel } from "@/models/Symptom"; // Model for Symptoms
import { dbConnect } from "@/lib/dbConnect"; // Database connection utility
import { NextResponse } from "next/server"; // For handling Next.js responses

export const GET = async (req) => {
  await dbConnect(); // Ensure DB connection is established

  try {
    // Parse the query parameter
    const { search } = req.nextUrl.searchParams;

    if (!search) {
      return NextResponse.json(
        { success: false, message: "Search query is required" },
        { status: 400 }
      );
    }

    let doctorIds = new Set(); // Use a Set to ensure unique IDs

    // 1. Collect doctor IDs from matching specialities
    const matchingSpecialities = await SpecialityModel.find({
      name: { $regex: search, $options: "i" }, // Case-insensitive search
    });
    matchingSpecialities.forEach((speciality) =>
      speciality.associated_doctors.forEach((docId) => doctorIds.add(docId.toString()))
    );

    // 2. Collect doctor IDs from matching diseases
    const matchingDiseases = await DiseaseModel.find({
      name: { $regex: search, $options: "i" },
    });
    matchingDiseases.forEach((disease) =>
      disease.associated_doctors.forEach((docId) => doctorIds.add(docId.toString()))
    );

    // 3. Collect doctor IDs from matching symptoms
    const matchingSymptoms = await SymptomModel.find({
      name: { $regex: search, $options: "i" },
    });
    matchingSymptoms.forEach((symptom) =>
      symptom.associated_doctors.forEach((docId) => doctorIds.add(docId.toString()))
    );

    // Convert Set to Array
    const uniqueDoctorIds = Array.from(doctorIds);

    if (uniqueDoctorIds.length === 0) {
      return NextResponse.json(
        { success: true, data: [], message: "No doctors found for the given query" },
        { status: 200 }
      );
    }

    // Fetch full doctor details
    const doctorDetails = await DoctorModel.find({ _id: { $in: uniqueDoctorIds } });

    return NextResponse.json(
      { success: true, data: doctorDetails },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error during search:", error);

    return NextResponse.json(
      { success: false, message: "An error occurred during the search" },
      { status: 500 }
    );
  }
};



// THIS WAS ORIGINAL APPROACH *************************************************************************

// import { DoctorModel } from "@/models/Doctor"; // Model for Doctors
// import { SpecialityModel } from "@/models/Speciality"; // Model for Specialities
// import { DiseaseModel } from "@/models/Disease"; // Model for Diseases
// import { SymptomModel } from "@/models/Symptom"; // Model for Symptoms
// import { dbConnect } from "@/lib/dbConnect"; // Database connection utility
// import { NextResponse } from "next/server"; // For handling Next.js responses

// // 💡Teaching Note: 
// // This API uses `route.js` to define endpoints with HTTP methods (e.g., GET, POST).
// // It aligns with Next.js App Router conventions.

// export const GET = async (req) => {
//   await dbConnect(); // 💡 Teaching Note: Ensure DB connection is established before querying.
  
//   try {
//     // Parse the query parameter
//     const { search } = req.nextUrl.searchParams; // Extract `query` parameter from URL
    

//     if (!search) {
//       return NextResponse.json(
//         { success: false, message: "Search query is required" },
//         { status: 400 }
//       );
//     }
//     let doctors = [];


//     // 1. Check for matching specialities
//     const matchingSpecialities = await SpecialityModel.find({
//       name: { $regex: search, $options: "i" }, // Case-insensitive regex match
//     }).populate("associated_doctors");


//     if (matchingSpecialities.length > 0) {
//       doctors = doctors.concat(
//         matchingSpecialities.flatMap((speciality) => speciality.associated_doctors)
//       );
//     }

//     // 2. Check for matching diseases
//     const matchingDiseases = await DiseaseModel.find({
//       name: { $regex: search, $options: "i" },
//     }).populate("associated_doctors");

//     if (matchingDiseases.length > 0) {
//       doctors = doctors.concat(
//         matchingDiseases.flatMap((disease) => disease.associated_doctors)
//       );
//     }

//     // 3. Check for matching symptoms
//     const matchingSymptoms = await SymptomModel.find({
//       name: { $regex: search, $options: "i" },
//     }).populate("associated_doctors");

//     if (matchingSymptoms.length > 0) {
//       doctors = doctors.concat(
//         matchingSymptoms.flatMap((symptom) => symptom.associated_doctors)
//       );
//     }

//     // Remove duplicate doctors
//     doctors = [...new Set(doctors.map((doc) => doc.toString()))]; // Unique doctor IDs

//     // Fetch full doctor details
//     const doctorDetails = await DoctorModel.find({ _id: { $in: doctors } });


//     return NextResponse.json(
//       { success: true, data: doctorDetails },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Error during search:", error);

//     return NextResponse.json(
//       { success: false, message: "An error occurred during the search" },
//       { status: 500 }
//     );
//   }
// };




// # Optimised Code for the above Code
// import { DoctorModel } from "@/models/Doctor";
// import { SpecialityModel } from "@/models/Speciality";
// import { DiseaseModel } from "@/models/Disease";
// import { SymptomModel } from "@/models/Symptom";
// import { dbConnect } from "@/lib/dbConnect";
// import { NextResponse } from "next/server";

// export const GET = async (req) => {
//   await dbConnect();

//   try {
//     const { search } = req.nextUrl.searchParams;

//     if (!search) {
//       return NextResponse.json(
//         { success: false, message: "Search query is required" },
//         { status: 400 }
//       );
//     }

//     // Step 1: Perform parallel searches across Specialities, Diseases, and Symptoms
//     const [matchingSpecialities, matchingDiseases, matchingSymptoms] =
//       await Promise.all([
//         SpecialityModel.find({
//           name: { $regex: search, $options: "i" },
//         }).select("associated_doctors"),
//         DiseaseModel.find({
//           name: { $regex: search, $options: "i" },
//         }).select("associated_doctors"),
//         SymptomModel.find({
//           name: { $regex: search, $options: "i" },
//         }).select("associated_doctors"),
//       ]);

//     // 💡 **Teaching Note**:
//     // `Promise.all` allows parallel execution of multiple queries, reducing total execution time.
//     // `.select("associated_doctors")` ensures only the required field is fetched.

//     // Step 2: Collect unique doctor IDs from all results
//     const doctorIds = new Set([
//       ...matchingSpecialities.flatMap((s) => s.associated_doctors),
//       ...matchingDiseases.flatMap((d) => d.associated_doctors),
//       ...matchingSymptoms.flatMap((s) => s.associated_doctors),
//     ]);

//     // 💡 **Teaching Note**:
//     // `Set` is used to automatically filter out duplicates while merging results.

//     // Step 3: Fetch detailed doctor data in a single query
//     const doctorDetails = await DoctorModel.find({ _id: { $in: [...doctorIds] } });

//     // Return results
//     return NextResponse.json(
//       { success: true, data: doctorDetails },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Error during search:", error);

//     return NextResponse.json(
//       { success: false, message: "An error occurred during the search" },
//       { status: 500 }
//     );
//   }
// };
