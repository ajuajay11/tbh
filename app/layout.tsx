 import Script from "next/script";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import "../app/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";

 
export const metadata = {
  title: "ToBeHonest – Share Your Truth",
  description: "Anonymous chronicles and stories",
  openGraph: {
    title: "ToBeHonest",
    description: "Anonymous stories",
    url: "https://www.tobehonest.club",
    siteName: "ToBeHonest",
  }, 

};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#980000",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const data = { mode: false };

  return (
    <html lang="en">
      <head>
        {/* Manifest and meta */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#980000" />
        <meta name="application-name" content="Tell Behind Here" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>

      <body className={` bg-black`}>
         <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4B1Z5TXWKT"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4B1Z5TXWKT');
          `}
        </Script>
        {data.mode ? (
          <main className="flex justify-center items-center min-h-screen text-white">
            <p>Site is currently under maintenance. </p>
          </main>
        ) : (
          <>
            <Header />
            <main className="w-full flex justify-center">
              <div className="w-full p-0 max-w-[1600px]">
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
