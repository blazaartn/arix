import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Add this
  preload: true, // Add this
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Add this
  preload: true, // Add this
});

export const metadata: Metadata = {
  title: "bacplus - Plateforme d'entraide pour le Bac Tunisien",
  description: "Rejoignez la communauté bacplus pour poser des questions, partager des cours, et collaborer sur des projets.",
  keywords: "bac, bacplus, bac tunisien, entraide, questions, cours",
  authors: [{ name: "bacplus" }],
  creator: "bacplus",
  publisher: "bacplus",
  robots: "index, follow",
  openGraph: {
    title: "bacplus - Plateforme d'entraide pour le Bac Tunisien",
    description: "Rejoignez la communauté bacplus pour poser des questions, partager des cours, et collaborer sur des projets.",
    url: "https://bac-plus.vercel.app",
    siteName: "bacplus",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://bac-plus.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "bacplus - Plateforme d'entraide pour le Bac Tunisien",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bacplus - Plateforme d'entraide pour le Bac Tunisien",
    description: "Rejoignez la communauté bacplus pour poser des questions, partager des cours, et collaborer sur des projets.",
    images: ["https://bac-plus.vercel.app/og-image.png"],
  },
  verification: {
    google: "your-google-site-verification-code",
  },
  category: "education",
  classification: "Educational Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}