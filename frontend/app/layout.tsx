import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "MindX",
  description: "MindX – Ask smarter questions. Get grounded answers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-black text-gray-100 ${spaceGrotesk.className}`}
      >
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
