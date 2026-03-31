import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    <html lang="en" className={`${plusJakarta.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
