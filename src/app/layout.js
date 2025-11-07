import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "./_components/ui/CookieConsent";
import RouteChangeOverlay from "./_components/ui/RouteChangeOverlay";
import NavigationLoader from "./_components/ui/NavigationLoader";
import ScrollToTop from "./_components/ui/ScrollToTop";
import MobileBottomNav from "./_components/layout/MobileBottomNav";
import MessageNotification from "./_components/ui/MessageNotification";
import { UniShareProvider } from "./lib/contexts/UniShareContext";
import ThemeWrapper from "./_components/ui/ThemeWrapper";
import SiteChrome from "./_components/layout/SiteChrome";
import DynamicIslandWrapper from "./_components/ui/DynamicIslandWrapper";

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
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <UniShareProvider>
          <ThemeWrapper>
            <ScrollToTop />
            <NavigationLoader />
            {/* <PageNavigationNotifier /> */}
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
