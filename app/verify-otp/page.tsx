"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession(); 
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const email = searchParams.get("email");


  useEffect(() => {
    if (timer > 0) {
      intervalRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [timer]);


  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Kode OTP baru sudah dikirim ke email Anda.");
        setTimer(60);
      } else {
        setError(data.error || "Gagal mengirim ulang OTP.");
      }
    } catch {
      setError("Terjadi kesalahan saat mengirim ulang OTP.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kode OTP salah atau sudah kadaluarsa.");
      } else {
        alert("✅ Akun berhasil diverifikasi!");
        await update(); 
        router.push("/login"); 
      }
    } catch {
      setError("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/10 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Verifikasi OTP</h1>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Masukkan kode OTP yang dikirim ke <br />
          <span className="font-semibold text-purple-300">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Masukkan kode OTP"
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-center tracking-widest text-xl font-semibold focus:outline-none"
            maxLength={6}
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </motion.button>
        </form>

        {/* Kirim ulang OTP */}
        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p className="text-gray-400 text-sm">
              Kirim ulang dalam {timer} detik
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-purple-300 hover:underline disabled:opacity-50"
            >
              {resending ? "Mengirim ulang..." : "Kirim ulang kode OTP"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
