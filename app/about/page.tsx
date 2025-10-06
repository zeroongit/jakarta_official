"use client";

import Link from "next/link";
import LiquidEther from "@/components/LiquidEther";
import BlurText from "@/components/BlurText";
import TrueFocus from "@/components/TrueFocus";
import Image from "next/image";

export default function AboutPage() {
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
      <div className="flex flex-col md:flex-row flex-1 items-center justify-center px-4 py-24 gap-12 md:gap-20 max-w-6xl mx-auto w-full">
        
        {/* Kiri: Foto */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/images/about-photo.jpg"
            alt="About Jakarta Official"
            className="max-w-full h-auto object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* Kanan: Teks */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <BlurText
            text="About Us"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text"
          />

          <TrueFocus 
            sentence="Jakarta Official"
            manualMode={false}
            blurAmount={5}
            borderColor="red"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />

          <p className="text-gray-200 text-lg md:text-xl mb-6 leading-relaxed">
            Jakarta Official adalah komunitas anak muda kreatif di Jakarta Barat yang bertujuan
            untuk menginspirasi dan mengembangkan bakat dalam bidang seni, teknologi, dan
            inovasi. Kami percaya bahwa kolaborasi dan kreativitas adalah kunci untuk membangun
            komunitas yang solid dan produktif.
          </p>

          <div className="flex gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-purple-600 rounded-full font-semibold hover:bg-purple-500 transition"
            >
              Home
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gray-700 rounded-full font-semibold hover:bg-gray-600 transition"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
