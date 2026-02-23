import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MinimalBlog — Stories Worth Reading",
  description: "A modern blog covering Technology, Lifestyle, Travel, and Design. Thoughtful stories for curious minds.",
  keywords: ["blog", "technology", "lifestyle", "travel", "design"],
  openGraph: {
    title: "MinimalBlog — Stories Worth Reading",
    description: "Thoughtful stories for curious minds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
