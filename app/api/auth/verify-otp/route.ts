import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    if (user.otp !== otp)
      return NextResponse.json({ error: "Kode OTP salah" }, { status: 400 });

    if (new Date(user.otpExpires).getTime() < Date.now())
      return NextResponse.json({ error: "Kode OTP kadaluarsa" }, { status: 400 });

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Akun berhasil diverifikasi" });
  } catch (err) {
    console.error("❌ Verify error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
