
import LayoutProvider from "@/components/layoutProvider";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevSync | Team Collaboration for Developers",
  description:
    "DevSync helps developer teams collaborate efficiently with project management, task tracking, real-time chat, and file sharing in one unified platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
