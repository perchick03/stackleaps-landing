import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackLeaps — We Book Qualified Sales Meetings",
  description:
    "Done-for-you cold email outreach that fills your calendar with decision-makers. Targeted campaigns, qualified meetings, zero guesswork.",
  openGraph: {
    title: "StackLeaps — We Book Qualified Sales Meetings",
    description:
      "Done-for-you cold email outreach that fills your calendar with decision-makers.",
    url: "https://stackleaps.com",
    siteName: "StackLeaps",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
