import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientWrapper from "@/components/ClientWrapper";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { Toaster } from "sonner"; 

export const metadata: Metadata = {
  title: "Jakarta Official",
  description: "Komunitas anak muda Jakarta Barat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body className="relative min-h-screen bg-black text-white overflow-x-hidden">
        {/* Background animasi */}
        <div className="fixed inset-0 -z-10">
          <ClientWrapper />
        </div>

        {/* Context Provider */}
        <Providers>
          <Navbar />
          <main className="relative z-10 pt-28">{children}</main>
          <Footer />

          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "rgba(45, 0, 70, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color: "#fff",
                fontWeight: 500,
                borderRadius: "14px",
                padding: "14px 20px",
                boxShadow:
                  "0 4px 30px rgba(150, 60, 255, 0.35), 0 0 50px rgba(120, 50, 255, 0.25)",
              },
              className: "font-sans tracking-wide text-sm",
              duration: 4000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
