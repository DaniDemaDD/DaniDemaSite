import type React from "react"
import Script from "next/script"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Site Under Development",
  description: "This site is currently under development.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Microsoft Clarity Script */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rd93c6mf8j");
          `}
        </Script>

        {/* Google Analytics Script */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','G-DY7J70X205');
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DY7J70X205');
            `,
          }}
        />

        {/* Framer Motion Script */}
        <Script
          id="framer-motion"
          src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"
          strategy="afterInteractive"
        />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Removed Navbar */}
          <div className="pt-0">{children}</div> {/* Adjusted padding as Navbar is removed */}
          {/* Removed FloatingSettingsButton */}
          <Toaster />
          {/* Removed CookieConsent */}
          {/* Removed BrowserDetector */}
          {/* Removed InteractiveTutorial */}
          {/* Vercel Speed Insights */}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
