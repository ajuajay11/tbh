import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import "../app/globals.css";
import AosInit from "./components/AosInit";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Tell Behind Here",
  description: "Something cool",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E40AF",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const data = { mode: false };

  return (
    <html lang="en">
      <head>
        {/* ✅ Google Tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4B1Z5TXWKT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4B1Z5TXWKT');
          `}
        </Script>

        {/* Manifest and meta */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1E40AF" />
        <meta name="application-name" content="Tell Behind Here" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        <AosInit />
        {data.mode ? (
          <main className="flex justify-center items-center min-h-screen text-white">
            <p>Site is currently under maintenance.</p>
          </main>
        ) : (
          <>
            <Header />
            <main className="w-full flex justify-center">
              <div className="w-full p-0 max-w-[1600px]" data-aos="fade-in">
                <Toaster position="top-center" />
                {children}
                <SpeedInsights />
              </div>
            </main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
