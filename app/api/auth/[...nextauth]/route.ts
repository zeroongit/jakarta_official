import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import nodemailer from "nodemailer";

// =========================================================
// 🔹 Helper untuk OTP
// =========================================================
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Jakarta Official" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Kode OTP Verifikasi Akun",
    text: `Kode OTP Anda adalah: ${otp}\n\nKode ini berlaku selama 5 menit.`,
  });
}

// =========================================================
// ⚙️ NEXTAUTH CONFIG
// =========================================================
const handler = NextAuth({
  providers: [
    // 🔹 Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🔹 Manual Login (Email & Password)
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

        // Jika user belum verifikasi OTP
        if (!user.verified) {
          throw new Error(`/verify-otp?email=${user.email}`);
        }

        // Validasi password
        if (!user.password) {
          throw new Error("Akun ini tidak menggunakan password (gunakan login Google)");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isPasswordCorrect) throw new Error("Invalid password");

        return user;
      },
    }),
  ],

  // =========================================================
  // 🧩 CALLBACKS
  // =========================================================
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // 🔹 Buat user baru tanpa password tapi perlu OTP
          const otp = generateOTP();
          const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

          existingUser = await User.create({
            communityId: `JKT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            name: user.name,
            email: user.email,
            phone: "",
            profileImage: user.image,
            password: null, // Tidak perlu password untuk Google
            otp,
            otpExpires,
            verified: false,
            provider: "google",
          });

          await sendOTP(user.email!, otp);
          return `/verify-otp?email=${user.email}`;
        }

        // 🚫 Kalau user lama tapi belum verifikasi OTP
        if (!existingUser.verified) {
          if (!existingUser.otp || existingUser.otpExpires < new Date()) {
            const otp = generateOTP();
            existingUser.otp = otp;
            existingUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
            await existingUser.save();
            await sendOTP(existingUser.email, otp);
          }
          return `/verify-otp?email=${existingUser.email}`;
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      // Tangani redirect yang berasal dari signIn() callback
      if (url.startsWith("/verify-otp")) {
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
          provider: user.provider || "manual",
        };
      }

      return session;
    },
  },

  // =========================================================
  // 🧠 SESSION CONFIG
  // =========================================================
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
