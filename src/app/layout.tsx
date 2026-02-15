import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#06b6d4",
};

export const metadata: Metadata = {
  title: "Zidril - للأفلام والمسلسلات",
  description: "موقع بحث سريع للأفلام والمسلسلات - ابحث عن أفلامك ومسلسلاتك المفضلة",
  keywords: ["أفلام", "مسلسلات", "تحميل", "مترجم", "movies", "series", "streaming"],
  authors: [{ name: "Zidril" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/5805405903170244120_120.jpg",
    apple: "/5805405903170244120_120.jpg",
  },
  openGraph: {
    title: "Zidril - للأفلام والمسلسلات",
    description: "موقع بحث سريع للأفلام والمسلسلات",
    type: "website",
    images: ["/5805405903170244120_120.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zidril - للأفلام والمسلسلات",
    description: "موقع بحث سريع للأفلام والمسلسلات",
    images: ["/5805405903170244120_120.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Zidril" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
