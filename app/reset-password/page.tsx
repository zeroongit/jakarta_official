"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password tidak sama");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Password berhasil diubah!");
      router.push("/login");
    } else {
      alert(data.error || "Gagal reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black/30 backdrop-blur-lg p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Reset Password</h1>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Masukkan password baru untuk akun <span className="text-purple-300">{email}</span>
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password baru"
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
          />
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Konfirmasi password"
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            type="submit"
            className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Ubah Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
