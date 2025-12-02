import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CitizenConnect - Empowering Pakistani Communities",
  description: "A unified platform for Pakistani citizens to access step-by-step solutions for local issues, connect with blood donors, request emergency help, and contribute to verified causes.",
  keywords: "civic issues, blood donation, emergency help, Pakistan, community, volunteers, donations",
  authors: [{ name: "CitizenConnect Team" }],
  openGraph: {
    title: "CitizenConnect - Empowering Pakistani Communities",
    description: "Step-by-step solutions for local issues. Connect with blood donors, volunteers, and verified causes.",
    type: "website",
    locale: "en_PK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8F9FA]`}
      >
        <Header />
        <main className="min-h-screen pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
