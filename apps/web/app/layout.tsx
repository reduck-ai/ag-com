import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@/app/_components/analytics";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

// The stylesheet is imported above: FontAwesome must not inject it again at runtime.
config.autoAddCss = false;

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopDuck",
  description: "The agent that shops anywhere to get you the best deals. Powered by Reduck.",
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html className={sans.variable} lang="en">
      <body>
        <Analytics />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
