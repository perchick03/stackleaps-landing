import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "StackLeaps - Fill Your Calendar with Vetted Partner Meetings",
  description:
    "We connect DMCs with tour operators, travel advisors, and event planners through personalized outreach. One DMC per destination.",
  openGraph: {
    title: "StackLeaps - Fill Your Calendar with Vetted Partner Meetings",
    description:
      "We connect DMCs with tour operators, travel advisors, and event planners through personalized outreach. One DMC per destination.",
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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
