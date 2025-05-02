import type { Metadata } from "next";
import { Quicksand } from 'next/font/google';
import "./globals.css";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: "Flash Learn",
  description: "Create and study flashcards",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
