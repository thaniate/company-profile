import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Studio — Digital Creative Agency",
    template: "%s | Studio",
  },
  description:
    "A creative studio crafting brands and digital products that matter.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Studio",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#111110",
              border: "1px solid #1e1e1b",
              color: "#f5f0e8",
              fontFamily: "var(--font-body)",
            },
          }}
        />
      </body>
    </html>
  );
}
