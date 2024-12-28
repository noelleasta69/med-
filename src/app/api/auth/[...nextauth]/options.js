import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
// import { UserModel } from "../../../../modles/Users";
// import { dbConnect } from "../../../../lib/dbConnect";
import UserModel from "@/modles/Users";
import dbConnect from "@/lib/dbConnect";


export const authOptions = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        type: {
          label: "Who are you? (patient/doctor)",
          type: "text",
          placeholder: "patient",
        },
        username: {
          label: "Full Name or Email",
          type: "text",
          placeholder: "jsmith_",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(
          "from authorize function------------------------------------------------"
        );

        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { name: credentials.username },
              { email: credentials.username },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email or username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            console.log("logged in ------------------------------->>")
            return user; // User authenticated successfully
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err) {
          throw new Error(err.message || "Authorization error");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("token from next-auth options: ", token);

      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }

      console.log("token later: ",token);

      return token; // Always return token when using JWT
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id,
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
          username: token.username,
        };
      }
      console.log("sesseion.user: ",session.user);
      return session;
    },
  },
  // pages: {
  //   signIn: "/sign-in",
  // },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
