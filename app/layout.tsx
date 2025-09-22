import type { Metadata  } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientWrapper from "@/components/ClientWrapper";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Jakarta Official",
  description: "Komunitas anak muda Jakarta Barat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background (client-side) */}
        <ClientWrapper />

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="relative z-10 pt-28">{children}</main>
        <Footer />
      </body>

    </html>
  );
}
