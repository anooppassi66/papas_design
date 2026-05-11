import type { Metadata } from "next";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PAPAS Willow Cricket Store",
  description: "Premium cricket equipment – bats, shoes, protective gear, clothing and more from the most trusted names in the game.",
  keywords: "cricket bats, cricket shoes, batting pads, batting gloves, cricket helmets, cricket equipment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </head>
      <body className="font-sans antialiased bg-white text-[#1e1e21]">
        <AnnouncementBar />
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
