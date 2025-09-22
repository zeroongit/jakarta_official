"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center justify-between gap-10 px-8 py-3 bg-transparent backdrop-blur-md rounded-full shadow-lg border border-white/10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          <span className="font-semibold">Jakarta Official</span>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <Link href="/about" className="hover:text-purple-400 transition">About</Link>
          <Link href="/contact" className="hover:text-purple-400 transition">Contact</Link>

          {isLoggedIn ? (
            <>
              <Link href="/shop" className="hover:text-purple-400 transition">Shop</Link>
              <Link href="/event" className="hover:text-purple-400 transition">Event</Link>
              <Link href="/profile" className="hover:text-purple-400 transition">My Profile</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-purple-400 transition">Login</Link>
              <Link href="/register" className="hover:text-purple-400 transition">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
