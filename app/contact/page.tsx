"use client";

import Link from "next/link";
import LiquidEther from "@/components/LiquidEther";
import Footer from "@/components/Footer";
import BlurText from "@/components/BlurText";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center text-white px-4 py-8 overflow-y-auto">
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

      {/* Konten utama */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-24 gap-6 max-w-3xl mx-auto">
        <BlurText
          text="Contact Us"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text"
        />

        <p className="text-gray-200 text-lg md:text-xl leading-relaxed">
          Hubungi komunitas kami melalui Email, Instagram, atau WhatsApp. Kami siap menjawab pertanyaan
          dan memberikan informasi seputar kegiatan komunitas.
        </p>

        {/* Kontak */}
        <div className="flex flex-row gap-6 text-lg md:text-xl mt-4 justify-center items-center">
        {/* Email */}
        <a
            href="mailto:jakartaofficial2020@gmail.com?subject=Halo%20Jakarta%20Official&body=Hai%20tim%20Jakarta%20Official,"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:scale-110 transition-transform"
        >
            <img src="/icons/gmail.png" alt="Email" className="w-10 h-10" />
        </a>

        {/* Instagram */}
        <a
            href="https://instagram.com/jkt_official20"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:scale-110 transition-transform"
        >
            <img src="/icons/instagram.png" alt="Instagram" className="w-10 h-10" />
        </a>

        {/* WhatsApp */}
        <a
            href="https://wa.me/6285189813441"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:scale-110 transition-transform"
        >
            <img src="/icons/whatsapp.png" alt="WhatsApp" className="w-10 h-10" />
        </a>
        </div>


        {/* Navigasi */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-gray-700 rounded-full font-semibold hover:bg-purple-600 transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 bg-gray-700 rounded-full font-semibold hover:bg-gray-600 transition"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
