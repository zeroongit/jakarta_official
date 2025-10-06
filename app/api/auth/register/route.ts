import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password, phone } = await req.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashed = password ? await bcrypt.hash(password, 10) : null;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

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
      subject: "Kode OTP Verifikasi",
      text: `Halo ${name},\n\nKode OTP Anda adalah: ${otp}\nBerlaku 5 menit.\n\nTerima kasih.`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Register berhasil. Cek email untuk OTP.",
        redirect: `/verify-otp?email=${email}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Register error:", err);
    return NextResponse.json(
      { success: false, message: "Gagal register" },
      { status: 500 }
    );
  }
}
