import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User, { IUser } from "@/models/User"; 

export async function GET(req: Request) {
  try {
    await connectDB();
    // Gunakan NextRequest jika Anda berada di Next.js 13/14 App Router
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


export async function PUT(req: Request) {
  try {
    await connectDB();
    // Mendapatkan data dari body request
    const body = await req.json(); 
    const { email, name, phone, profileImage } = body;

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }


    const updateData: Partial<IUser> = {};
    
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profileImage) updateData.profileImage = profileImage;

    // Pastikan updateData tidak kosong sebelum update
    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: "Tidak ada data yang perlu diperbarui" }, { status: 400 });
    }

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
    // Mendapatkan data dari body request
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