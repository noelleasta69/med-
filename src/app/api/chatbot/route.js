import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    let { prompt } = await req.json();
    console.log("prompt: ", prompt);
    const myPrompt =
      "You are an AI on a medical website designed to answer only medical-related queries. If the query is unrelated to medicine, respond with 'This platform is for medical queries only.' Limit your answers to a maximum of 50 words.";

    // prompt = myPrompt + " " + prompt;

    const { text, experimental_providerMetadata } = await generateText({
      model: google("gemini-1.5-pro-latest", {
        useSearchGrounding: true,
      }),
      prompt: prompt,
    });

    const metadata = experimental_providerMetadata?.google;
    const groundingMetadata = metadata?.groundingMetadata;
    const safetyRatings = metadata?.safetyRatings;

    return NextResponse.json({
      message: prompt,
      ans: text,
    });
  } catch (error) {
    console.error("Error occurred_______> ", error);
    return NextResponse.json(
      {
        message: "There was an error",
      },
      {
        status: 500,
      }
    );
  }
};
