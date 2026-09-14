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
  title: "Lyricly — Scene to Lyrics, Music & Visual Direction",
  description:
    "Describe any moment or scene in any language (especially Malayalam) and generate evocative song lyrics, Suno/Udio music prompts, and album cover art direction.",
  keywords: ["lyrics generator", "malayalam lyrics", "suno prompt generator", "album art generator", "songwriting ai"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoMalayalam.variable} dark`}>
      <body className="min-h-screen bg-[#0d0f12] text-[#f1f5f9] font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
