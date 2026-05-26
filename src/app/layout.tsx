import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "StackLeaps - Fill Your Calendar with Qualified Sales Meetings",
  description:
    "Done-for-you B2B lead generation. We find your ideal customers, reach out on your behalf, and book qualified sales meetings on your calendar. One client per niche.",
  openGraph: {
    title: "StackLeaps - Fill Your Calendar with Qualified Sales Meetings",
    description:
      "Done-for-you B2B lead generation. We find your ideal customers, reach out on your behalf, and book qualified sales meetings on your calendar. One client per niche.",
    url: "https://stackleaps.com",
    siteName: "StackLeaps",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const country = (await headers()).get("x-vercel-ip-country");
  const skipAnalytics = country === "BG";
  return (
    <html lang="en" className={`${plusJakarta.variable} antialiased`}>
      <body>
        {children}
        {!skipAnalytics && <Analytics />}
      </body>
    </html>
  );
}
