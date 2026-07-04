import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_Sinhala, Poppins } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Sinhala glyph coverage for the si locale (SRS §2).
const notoSinhala = Noto_Sans_Sinhala({
  variable: "--font-sinhala",
  subsets: ["sinhala"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Student Data Management System · Hunuwala Dharmaraja Vidyalaya",
    template: "%s · HDV SMS",
  },
  description:
    "Official student records portal for Hunuwala Dharmaraja Vidyalaya.",
  icons: { icon: "/brand/emblem.jpg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${geistMono.variable} ${notoSinhala.variable} min-h-svh antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
