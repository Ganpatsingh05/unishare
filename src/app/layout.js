import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UniShareProvider } from "./lib/contexts/UniShareContext";
import ClientLayoutComponents from "./_components/layout/ClientLayoutComponents";
import ClientUIComponents from "./_components/ui/ClientUIComponents";

// ✅ PERFORMANCE: Optimized font loading with display swap to prevent FOIT
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevents invisible text flash
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only preload critical fonts
  fallback: ['Consolas', 'Monaco', 'monospace'],
});

export const metadata = {
  title: "UniShare",
  description: "Developed By OrByteX|Solutions",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <UniShareProvider>
          <ClientLayoutComponents>
            {children}
          </ClientLayoutComponents>
          <ClientUIComponents />
        </UniShareProvider>
      </body>
    </html>
  );
}
