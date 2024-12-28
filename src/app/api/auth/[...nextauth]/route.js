import NextAuth from "next-auth";
import { authOptions } from "./options";

// here name should be handler 
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}