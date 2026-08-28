import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hikayat — The Quiet Invitation",
  description: "An interactive AI-harm simulation about evidence, responsibility, and intervention.",
  openGraph: {
    title: "Hikayat",
    description: "Step inside an unfolding AI incident.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hikayat — Step inside an unfolding AI incident." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hikayat",
    description: "Step inside an unfolding AI incident.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
