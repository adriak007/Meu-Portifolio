import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { FluidBackground } from "@/components/fluid-background";
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
  title: "Adriano JR | Desenvolvedor Front-End",
  description:
    "Adriano Da Silva Dantas Junior, desenvolvedor de software focado em front-end (React, Next.js, Tailwind) e estudante de ADS na UNIFIP."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <FluidBackground />
        <ScrollProgress />
        <ScrollObserver />
        <SmoothScroll />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
