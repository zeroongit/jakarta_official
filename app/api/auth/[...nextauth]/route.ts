import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isPasswordCorrect) throw new Error("Invalid password");

        if (!user.verified) {
          throw new Error(`/verify-otp?email=${user.email}`);
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // 🚀 Belum daftar → arahkan ke halaman register
          return ('/register?email=' + user.email);
        }

        if (!existingUser.verified) {
          // 🚫 Belum verifikasi
          throw new Error(`/verify-otp?email=${user.email}`);
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/verify-otp") || url.startsWith("/register")) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },

    async session({ session }) {
      await connectDB();
      if (!session.user?.email) return session;

      const user = await User.findOne({ email: session.user.email });
      if (user) {
        session.user = {
          ...session.user,
          id: user._id.toString(),
          communityId: user.communityId,
          phone: user.phone,
          verified: user.verified,
        };
      }
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
