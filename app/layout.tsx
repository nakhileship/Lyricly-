import type { Metadata } from "next";
import { Inter, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoMalayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-malayalam",
  subsets: ["malayalam"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lyricly — Human-Heart Songwriting in Any Language",
  description:
    "Describe any scene or moment in any language and get human-sounding lyrics, Suno AI music prompts, and album cover art. Supports Malayalam, Hindi, Tamil, Telugu, Kannada, Arabic, English, Spanish, Korean, Japanese, and more.",
  keywords: [
    "lyrics generator",
    "ai songwriter",
    "malayalam lyrics",
    "hindi lyrics",
    "tamil lyrics",
    "suno prompt generator",
    "multilingual lyrics",
    "album art generator",
    "songwriting ai",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoMalayalam.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600&family=Noto+Sans+JP:wght@400;600&family=Noto+Sans+KR:wght@400;600&family=Noto+Sans+Kannada:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&family=Noto+Sans+Telugu:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0d0f12] text-[#f1f5f9] font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
