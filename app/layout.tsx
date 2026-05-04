import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { BackToTop } from "@/components/back-to-top";
import { ScrollObserver } from "@/components/scroll-observer";
import { ScrollProgress } from "@/components/scroll-progress";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"]
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Adriano JR | Desenvolvedor Web e Empresario",
  description:
    "Adriano Da Silva Dantas Junior, desenvolvedor web e estudante de ADS na FIP."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <ScrollProgress />
        <ScrollObserver />
        <SmoothScroll />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
