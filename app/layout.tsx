import Script from "next/script";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import "../app/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import GlobalAOS from "./components/GlobalAOS";

export const metadata = {
  title: "ToBeHonest – Share Your Truth",
  description: "Anonymous chronicles and stories",
  manifest: "/manifest.json",
  themeColor: "#980000",
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "Tell Behind Here",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#980000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const data = { mode: false };

  return (
    <html lang="en">
      <body className="bg-black">

        {/* Google Analytics (optimized) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4B1Z5TXWKT"
          strategy="lazyOnload"
        />
        <Script id="ga" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4B1Z5TXWKT');
          `}
        </Script>
<GlobalAOS />
        {data.mode ? (
          <main className="flex justify-center items-center min-h-screen text-white">
            <p>Site is currently under maintenance.</p>
          </main>
        ) : (
          <>
            <Header />
            <main className="w-full flex justify-center">
              <div className="w-full max-w-[1600px]">
                <Toaster position="top-center" />
                {children}
              </div>
            </main>
            <Footer />
          </>
        )}

        <SpeedInsights />
      </body>
    </html>
  );
}
