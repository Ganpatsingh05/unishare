import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "./_components/CookieConsent";
import RouteChangeOverlay from "./_components/RouteChangeOverlay";
import { UniShareProvider } from "./lib/contexts/UniShareContext";
import ClientHeader from "./_components/ClientHeader";
import AnnouncementBar from "./_components/AnnouncementBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UniShare",
  description: "Developed By OrByteX|Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <UniShareProvider>
          <AnnouncementBar />
          <ClientHeader />
          {children}
          <CookieConsent />
          {/* Client-side route change loader overlay */}
          <RouteChangeOverlay />
        </UniShareProvider>
      </body>
    </html>
  );
}