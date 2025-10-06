import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// ✅ GET user by email
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email diperlukan" }, { status: 400 });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Error GET user:", error);
    return NextResponse.json({ error: "Gagal memuat data user" }, { status: 500 });
  }
}

// ✅ PUT update user (nama, telepon, foto profil)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { email, name, phone, profileImage } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
      user,
    });
  } catch (error) {
    console.error("❌ Error PUT user:", error);
    return NextResponse.json({ error: "Gagal update profil" }, { status: 500 });
  }
}

// ✅ DELETE user
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Akun berhasil dihapus",
    });
  } catch (error) {
    console.error("❌ Error DELETE user:", error);
    return NextResponse.json({ error: "Gagal menghapus akun" }, { status: 500 });
  }
}
