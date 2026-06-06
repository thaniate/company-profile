import type { Metadata } from "next";
import { Playfair_Display, Space_Mono, Abril_Fatface } from "next/font/google";
import { Toaster } from "sonner";
import { constructMetadata } from "@/lib/metadata";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${spaceMono.variable} ${abrilFatface.variable}`}
    >
      <body>
        <div className="cursor" id="cursor" />
        {children}
        <Toaster
          theme="light"
          toastOptions={{
            style: {
              background: "#fdf5e8",
              border: "1.5px solid #930500",
              color: "#1a0000",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
            },
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const cursor = document.getElementById('cursor');
              let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
              document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
              (function animate() {
                cursorX += (mouseX - cursorX) * 0.15;
                cursorY += (mouseY - cursorY) * 0.15;
                cursor.style.left = cursorX + 'px';
                cursor.style.top = cursorY + 'px';
                requestAnimationFrame(animate);
              })();
              document.addEventListener('mouseover', e => {
                if (e.target.closest('a, button, [data-cursor]')) cursor.classList.add('hover');
                else cursor.classList.remove('hover');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}