import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { UploadApiErrorResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""; 

    // 🧩 Kasus 1: jika base64 (JSON body)
    if (contentType.includes("application/json")) {
      const { image }: { image: string | undefined } = await req.json();
      if (!image) {
        return NextResponse.json(
          { success: false, message: "No image data provided" },
          { status: 400 }
        );
      }

      const result: UploadApiResponse = await cloudinary.uploader.upload(image, {
        folder: "jakarta_official",
      });

      return NextResponse.json({ success: true, url: result.secure_url });
    }

    // 🧩 Kasus 2: jika FormData (upload file langsung)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, message: "No file provided" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "jakarta_official" },
          (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error) reject(error);
            else if (result) resolve(result); 
            else reject(new Error("Cloudinary upload failed with no error message."));
          }
        );
        uploadStream.end(buffer);
      });
      
      return NextResponse.json({
        success: true,
        url: result.secure_url, 
      });
    }

    return NextResponse.json(
      { success: false, message: "Unsupported content type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}