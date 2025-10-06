import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { success: false, message: "Akun sudah diverifikasi" },
        { status: 400 }
      );
    }

    // 🔹 Generate OTP baru dan waktu expired baru
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    // 🔹 Update user
    user.otp = newOtp;
    user.otpExpires = newOtpExpires;
    await user.save();

    // 🔹 Kirim ulang email OTP
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
      subject: "Kode OTP Baru untuk Verifikasi",
      text: `Halo ${user.name},\n\nBerikut kode OTP baru Anda: ${newOtp}\nBerlaku selama 5 menit.\n\nTerima kasih.`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kode OTP baru telah dikirim ke email Anda",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error resend OTP:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengirim ulang OTP" },
      { status: 500 }
    );
  }
}
