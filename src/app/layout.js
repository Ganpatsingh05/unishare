import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "./_components/CookieConsent";
import RouteChangeOverlay from "./_components/RouteChangeOverlay";
import NavigationLoader from "./_components/NavigationLoader";
import InitialAppLoader from "./_components/InitialAppLoader";
import ScrollToTop from "./_components/ScrollToTop";
import { UniShareProvider } from "./lib/contexts/UniShareContext";
import ThemeWrapper from "./_components/ThemeWrapper";
import SiteChrome from "./_components/SiteChrome";

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
          <ThemeWrapper>
            <ScrollToTop />
            <InitialAppLoader />
            <NavigationLoader />
            <SiteChrome>
              {children}
            </SiteChrome>
            <CookieConsent />
            {/* Client-side route change loader overlay */}
            <RouteChangeOverlay />
          </ThemeWrapper>
        </UniShareProvider>
      </body>
    </html>
  );
}