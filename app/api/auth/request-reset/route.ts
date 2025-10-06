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
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 404 });
    }

    // Buat OTP (berlaku 10 menit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;
    await user.save();

    // Kirim email
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
      subject: "Kode OTP Reset Password",
      text: `Halo, kode OTP untuk reset password kamu adalah: ${otp}. Berlaku 10 menit.`,
    });

    return NextResponse.json({ success: true, message: "OTP dikirim ke email kamu" });
  } catch (error) {
    console.error("Reset request error:", error);
    return NextResponse.json({ error: "Gagal mengirim OTP" }, { status: 500 });
  }
}
