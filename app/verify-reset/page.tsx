"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifyResetPage() {
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/verify-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("OTP benar! Silakan ubah password kamu.");
      router.push(`/reset-password?email=${encodeURIComponent(email!)}`);
    } else {
      alert(data.error || "Kode OTP salah atau kadaluarsa.");
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
        <h1 className="text-3xl font-bold mb-4 text-center">Verifikasi OTP</h1>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Masukkan kode OTP yang dikirim ke <span className="text-purple-300">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Masukkan kode OTP"
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            type="submit"
            className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
