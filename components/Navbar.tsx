"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status, update } = useSession(); // ✅ include update()
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    const checkVerification = async () => {
      if (isLoggedIn && !session?.user?.verified) {
        await update(); 
      }
    };
    checkVerification();
  }, [isLoggedIn, session, update]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
      <div className="flex items-center justify-between px-6 py-3 bg-transparent rounded-full shadow-lg border border-white/10">
        
        {/* 🌐 Logo */}
        <div className="flex items-center gap-2 text-white font-semibold">
          <span className="text-2xl">🌐</span>
          <span>Jakarta Official</span>
        </div>

        {/* 🖥️ Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <Link href="/about" className="hover:text-purple-400 transition">About</Link>
          <Link href="/contact" className="hover:text-purple-400 transition">Contact</Link>

          {isLoggedIn ? (
            <>
              <Link href="#" className="hover:text-purple-400 transition">Shop</Link>
              <Link href="#" className="hover:text-purple-400 transition">Event</Link>
              <Link href="/profile" className="hover:text-purple-400 transition">My Profile</Link>

              {/* ✅ Verifikasi status */}
              <AnimatePresence>
                {session?.user?.verified && (
                  <motion.span
                    key="verified-badge"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-3 py-1 bg-green-600/40 rounded-full text-xs font-semibold border border-green-400"
                  >
                    ✅ Verified
                  </motion.span>
                )}
              </AnimatePresence>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-purple-400 transition">Login</Link>
              <Link href="/register" className="hover:text-purple-400 transition">Daftar</Link>
            </>
          )}
        </div>

        {/* 📱 Mobile Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 flex flex-col items-center gap-4 bg-black/30 backdrop-blur-md rounded-xl py-4 shadow-lg border border-white/10">
          <Link href="/" className="hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/about" className="hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/contact" className="hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Contact</Link>

          {isLoggedIn ? (
            <>
              <Link href="/shop" className="hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Shop</Link>
              <Link href="/event" className="hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Event</Link>
              <Link href="/profile" className="hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>My Profile</Link>

              {/* ✅ Badge di mobile juga */}
              {session?.user?.verified && (
                <span className="px-3 py-1 bg-green-600/40 rounded-full text-xs font-semibold border border-green-400">
                  ✅ Verified
                </span>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Login</Link>
              <Link href="/register" className="hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Daftar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
