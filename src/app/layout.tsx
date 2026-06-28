import type { Metadata } from "next";
import { DM_Sans, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  weight: ["100", "400", "700", "800", "900"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Kaami — Prove Your Worth",
  description:
    "Kaami is the ultimate ledger for builders. UNLIMITED verifications, real-time endorsements, and 100% verified credentials for FREE. No more fake resumes.",
  openGraph: {
    title: "Kaami — Prove Your Worth",
    description:
      "Kaami is the ultimate ledger for builders. UNLIMITED verifications, real-time endorsements, and 100% verified credentials for FREE.",
    type: "website",
    url: "https://kaami.example.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaami — Prove Your Worth",
    description:
      "Kaami is the ultimate ledger for builders. UNLIMITED verifications, real-time endorsements, and 100% verified credentials for FREE.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${hankenGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FFF9E6]">
        {children}
      </body>
    </html>
  );
}
