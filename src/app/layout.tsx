import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrismViz",
  description: "Next.js-based interactive data visualization web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/prismicon.ico"/>
      <body>
        {children}
      </body>
    </html>
  );
}
