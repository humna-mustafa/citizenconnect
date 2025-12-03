import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { constructMetadata } from "@/lib/metadata";
import CivicAssistant from "@/components/CivicAssistant";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = constructMetadata({
  title: "CitizenConnect - Empowering Pakistani Communities",
  description: "A unified platform for Pakistani citizens to access step-by-step solutions for local issues, connect with blood donors, request emergency help, and contribute to verified causes.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <Header />
        <main className="min-h-screen pt-16 lg:pt-20">
          {children}
        </main>
        <CivicAssistant />
        <Toaster position="top-center" richColors />
        <Footer />
      </body>
    </html>
  );
}
