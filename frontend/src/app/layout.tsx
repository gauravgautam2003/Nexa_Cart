import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "NexaCart — Smart online shopping, verified by AI",
        template: "%s | NexaCart",
    },
    description:
        "NexaCart is an AI-verified online marketplace: every listing is checked by the NexaGuard agent before it reaches you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <StoreProvider>
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </StoreProvider>
            </body>
        </html>
    );
}
