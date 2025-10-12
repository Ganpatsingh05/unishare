import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "./_components/CookieConsent";
import RouteChangeOverlay from "./_components/RouteChangeOverlay";
import NavigationLoader from "./_components/NavigationLoader";
import ScrollToTop from "./_components/ScrollToTop";
import MobileBottomNav from "./_components/MobileBottomNav";
import MessageNotification from "./_components/MessageNotification";
import { UniShareProvider } from "./lib/contexts/UniShareContext";
import ThemeWrapper from "./_components/ThemeWrapper";
import SiteChrome from "./_components/SiteChrome";
import DynamicIslandWrapper from "./_components/DynamicIslandWrapper";
import PageNavigationNotifier from "./_components/PageNavigationNotifier";

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
            <NavigationLoader />
            <PageNavigationNotifier />
            <SiteChrome>
              {children}
            </SiteChrome>
            <MobileBottomNav />
            <CookieConsent />
            <MessageNotification />
            <DynamicIslandWrapper />
            {/* Client-side route change loader overlay */}
            <RouteChangeOverlay />
          </ThemeWrapper>
        </UniShareProvider>
      </body>
    </html>
  );
}