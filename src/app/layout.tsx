import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./lib/ThemeContext";
import { DotAnimationProvider } from "./lib/DotAnimationContext";
import { TypeStyleProvider } from "./lib/TypeStyleContext";
import SideNav from "./components/SideNav";

export const metadata: Metadata = {
  title: "Nathan Ulrich - NYC Software Designer",
  description: "I'm a semi-technical designer in NY who builds apps. Currently I'm a Senior Product Designer at Patreon.",
  openGraph: {
    title: "Nathan Ulrich - NYC Software Designer",
    description: "I'm a semi-technical designer in NY who builds apps. Currently I'm a Senior Product Designer at Patreon.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nathan Ulrich - NYC Software Designer",
    description: "I'm a semi-technical designer in NY who builds apps. Currently I'm a Senior Product Designer at Patreon.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">
        <ThemeProvider>
          <TypeStyleProvider>
            <DotAnimationProvider>
              <SideNav />
              <div className="lg:ml-[228px]">
                {children}
              </div>
            </DotAnimationProvider>
          </TypeStyleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
