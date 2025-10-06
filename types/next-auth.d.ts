import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      communityId: string;
      name: string;
      email: string;
      phone: string;
      image?: string;
      verified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    communityId: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
    verified: boolean; 
  }
}
