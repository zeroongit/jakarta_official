import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, newPassword } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
