"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useSWR, { mutate } from "swr";
import { useState, useRef } from "react";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", profileImage: "" });
  const [uploading, setUploading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  if (status === "unauthenticated") redirect("/login");

  const { data: user, error } = useSWR(
    session?.user?.email ? `/api/user?email=${session.user.email}` : null,
    fetcher
  );

  if (status === "loading" || !user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Loading...</p>
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center mt-20">Gagal ambil data user</p>;

  const handleEdit = () => {
    setEditing(true);
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      profileImage: user.profileImage || "/images/default-avatar.jpg",
    });
  };

  const handleSave = async () => {
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, ...form }),
    });

    if (res.ok) {
      mutate(`/api/user?email=${user.email}`);
      setEditing(false);
    } else {
      alert("Gagal update profile");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin mau hapus akun?")) return;

    const res = await fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });

    if (res.ok) await signOut({ callbackUrl: "/" });
    else alert("Gagal hapus akun");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await res.json();
        if (data.success && data.url) {
          setForm({ ...form, profileImage: data.url });
        } else {
          alert("Upload gagal");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Gagal upload ke Cloudinary");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

 
  const handleMouseDown = () => {
    holdTimer.current = setTimeout(() => setShowImage(true), 3000);
  };
  const handleMouseUp = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md z-10"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

        {!editing ? (
          <>
            <div className="flex items-center gap-4">
              <Image
                src={user.profileImage || "/images/default-avatar.jpg"}
                alt="User Avatar"
                className="w-16 h-16 rounded-full border border-white/30 cursor-pointer"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
              />
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-gray-300 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Community ID:</span>{" "}
                {user.communityId}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {user.phone || "-"}
              </p>
            </div>

            <div className="mt-6 flex justify-between gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleEdit}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
              >
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
              >
                Hapus Akun
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <label className="block mb-3">
              <span className="text-sm text-gray-300">Foto Profil</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-gray-300"
              />
              {uploading ? (
                <p className="text-xs text-gray-400 mt-1">Mengupload...</p>
              ) : (
                <Image
                  src={form.profileImage || "/images/default-avatar.jpg"}
                  alt="Preview"
                  className="mt-3 w-20 h-20 rounded-full border border-white/20 object-cover"
                />
              )}
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama"
              className="w-full px-4 py-2 mb-3 rounded-lg bg-white/20 border border-white/30"
            />
            <input
              type="text"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Nomor Telepon"
              className="w-full px-4 py-2 mb-3 rounded-lg bg-white/20 border border-white/30"
            />

            <div className="mt-6 flex justify-between gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSave}
                disabled={uploading}
                className="flex-1 py-2 bg-green-500 hover:bg-green-600 rounded-lg disabled:opacity-50"
              >
                {uploading ? "Menyimpan..." : "Simpan"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setEditing(false)}
                className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg"
              >
                Batal
              </motion.button>
            </div>
          </>
        )}
      </motion.div>

      {/* 🔍 Zoom Image */}
      <AnimatePresence>
        {showImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => setShowImage(false)}
          >
            <motion.img
              src={user.profileImage || "/images/default-avatar.jpg"}
              alt="Zoomed Avatar"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-xs md:max-w-md rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
