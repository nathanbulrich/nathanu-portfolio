import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./lib/ThemeContext";
import { DotAnimationProvider } from "./lib/DotAnimationContext";
import SideNav from "./components/SideNav";

export const metadata: Metadata = {
  title: "Nathan Ulrich - NYC Software Designer",
  description: "I'm a semi-technical designer in NY who builds apps. Currently I'm a Senior Product Designer at Patreon.",
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
          <DotAnimationProvider>
            <SideNav />
            <div className="lg:ml-[228px]">
              {children}
            </div>
          </DotAnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
