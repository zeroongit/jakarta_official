"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import LiquidEther from "@/components/LiquidEther";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: prefilledEmail,
    password: "",
    phone: "",
  });

  useEffect(() => {
    if (prefilledEmail) setForm((f) => ({ ...f, email: prefilledEmail }));
  }, [prefilledEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("OTP sudah dikirim ke email Anda.");
      router.push(`/verify-otp?email=${form.email}`);
    } else {
      alert(data.message || "Register gagal.");
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center text-white overflow-y-auto">
      <div className="fixed inset-0 -z-10">
        <LiquidEther colors={["#5227FF", "#FF9FFC", "#B19EEF"]} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-transparent p-8 rounded-2xl shadow-2xl border border-white/20"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            readOnly={!!prefilledEmail}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white"
          />
          {!prefilledEmail && (
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white"
            />
          )}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        {!prefilledEmail && (
          <>
            <div className="my-6 flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-white/30" />
              <span className="text-gray-300 text-sm">OR</span>
              <div className="h-px w-16 bg-white/30" />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => signIn("google")}
              className="w-full py-3 bg-white text-gray-800 flex items-center justify-center gap-2 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              <FcGoogle size={22} />
                Daftar dengan google
            </motion.button>
          </>
        )}

        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-300 hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
