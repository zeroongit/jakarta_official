import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const isExpired = new Date(user.resetOtpExpires).getTime() < Date.now();

    if (user.resetOtp !== otp) return NextResponse.json({ error: "Kode OTP salah" }, { status: 400 });
    if (isExpired) return NextResponse.json({ error: "Kode OTP kadaluarsa" }, { status: 400 });

    return NextResponse.json({ success: true, message: "OTP benar, lanjut reset password" });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
