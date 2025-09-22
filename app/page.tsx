"use client";

import Link from "next/link";
import LiquidEther from "@/components/LiquidEther";

export default function HomePage({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="relative text-white">
      {/* Background global */}
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

      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-6">
        <div className="font-bold text-lg">Jakarta Official</div>
        <div className="flex gap-4">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="ml-auto">
          {isLoggedIn ? (
            <a href="/profile" className="hover:underline">
              My Profile
            </a>
          ) : (
            <a href="/login" className="hover:underline">
              Login
            </a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="h-screen flex flex-col items-center justify-center text-center bg-black/40 backdrop-blur-sm"
      >
        <h1 className="text-4xl md:text-6xl font-bold">
          Selamat Datang di{" "}
          <span className="text-purple-400">Jakarta Official</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200">
          Komunitas anak muda kreatif di Jakarta Barat
        </p>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6">About Us</h2>
          <p className="text-lg text-gray-200">
            Jakarta Official adalah komunitas anak muda dari Kembangan, Jakarta
            Barat. Kami hadir untuk berbagi ide, mengadakan event, dan membangun
            jaringan kreatif. Gabung untuk terhubung dengan sesama dan tumbuh
            bersama.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <h2 className="text-4xl font-bold mb-6">Contact</h2>
        <p className="text-lg text-gray-200 mb-4">
          Punya pertanyaan? Hubungi kami di:
        </p>
        <a
          href="mailto:info@jakartaofficial.com"
          className="text-purple-400 hover:underline"
        >
          info@jakartaofficial.com
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 text-center py-6">
        <p className="text-gray-400">
          © 2025 Jakarta Official. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
