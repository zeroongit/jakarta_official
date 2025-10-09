"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import LiquidEther from "@/components/LiquidEther";
import BlurText from "@/components/BlurText";
import TrueFocus from "@/components/TrueFocus";

export default function HomePage() {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="relative text-white">
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

      <div className="h-screen flex flex-col items-center justify-center text-center bg-transparent px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold space-y-3">
            {/* BlurText dengan gradient */}
            <BlurText
              text="Welcome To"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="inline-block px-2 bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text  mb-8"
            />

            {/* TrueFocus */}
            <TrueFocus 
            sentence="Jakarta Official"
            manualMode={false}
            blurAmount={5}
            borderColor="red"
            animationDuration={2}
            pauseBetweenAnimations={1}
            />
          </h1>
        </div>

        <p className="mt-4 text-lg md:text-xl text-gray-200">
          Youth Community Creative at West Jakarta.
        </p>

        <div className="mt-6 flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 bg-gray-700 rounded-full font-semibold hover:bg-gray-600 transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
