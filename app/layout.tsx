import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "RPF Sporthorses | Raeford, NC",
  description: "Premier equestrian training facility in Raeford, North Carolina. Lessons, training, boarding, and more.",
  keywords: "horse lessons, equestrian training, Raeford NC, sporthorses, hunter jumper",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  )
}
