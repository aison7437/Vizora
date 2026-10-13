import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "VISIORA — Your AI Style Studio", description: "A thoughtful personal styling companion." };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
