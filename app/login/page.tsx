"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import LiquidEther from "@/components/LiquidEther";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/");
    } else {
      alert("Login gagal. Cek email/password.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      // Langsung login via Google, tanpa OTP
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login Google gagal:", error);
      alert("Login dengan Google gagal.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center text-white overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Card with animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-transparent p-8 rounded-2xl shadow-2xl border border-white/20"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 focus:bg-white/30 border border-white/30 placeholder-gray-200 text-white focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 focus:bg-white/30 border border-white/30 placeholder-gray-200 text-white focus:outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-4">
          <Link href="/forgot-password" className="text-purple-300 hover:underline">
            Forgot your password?
          </Link>
        </p>

        {/* OR divider */}
        <div className="my-6 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-white/30" />
          <span className="text-gray-300 text-sm">OR</span>
          <div className="h-px w-16 bg-white/30" />
        </div>

        {/* Google login */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 bg-white text-gray-800 flex items-center justify-center gap-2 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
        >
          <FcGoogle size={22} />
          {loading ? "Connecting..." : "Continue with Google"}
        </motion.button>

        <p className="text-center text-sm text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-purple-300 hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
