import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

 
    if (!password) {
        return NextResponse.json(
            { success: false, message: "Password harus diisi" },
            { status: 400 }
        );
    }
    const hashedPassword = await bcrypt.hash(password, 10);


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

  
    await User.create({
      communityId: `JKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      name,
      email,
      password: hashedPassword, 
      otp: otp, 
      otpExpires: otpExpires,
      verified: false,
    });

    // 4. Kirim Email
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
  } catch (_err) { 
    console.error("❌ Register error:", _err);
    return NextResponse.json(
      { success: false, message: "Gagal register" },
      { status: 500 }
    );
  }
}