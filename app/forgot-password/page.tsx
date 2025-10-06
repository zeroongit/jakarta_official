"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("OTP telah dikirim ke email kamu!");
      router.push(`/verify-reset?email=${encodeURIComponent(email)}`);
    } else {
      alert(data.error || "Gagal mengirim OTP");
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
        <h1 className="text-3xl font-bold mb-4 text-center">Forgot Password</h1>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Masukkan email kamu untuk menerima kode OTP reset password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email kamu"
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            type="submit"
            className="w-full py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim OTP"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
