import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font"; // Updated import path, removed aliases as they are no longer needed
import "./globals.css";

// The fonts are now objects, not functions to call
// const geistSans = Geist({ ... }); // Remove this
// const geistMono = Geist_Mono({ ... }); // Remove this

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Use the variable properties directly from the imported objects */}
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
