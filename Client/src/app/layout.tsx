import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { PrimeReactProvider } from 'primereact/api';
// import "primereact/resources/themes/mira/theme.css";
import 'primeicons/primeicons.css';

import Header from "../components/header"
import Footer from "../components/footer"
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CCG CollisionCareGuide",
    description: "法律法遵機器人",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
            <body className="min-h-screen bg-gray-200">
                <PrimeReactProvider >
                    <Header />

                    {children}

                    {/* <Footer /> */}
                </PrimeReactProvider>
            </body>
        </html>
    );
}
