import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/mira/theme.css";


import './globals.css'
import Tailwind from 'primereact/passthrough/tailwind';
import { twMerge } from 'tailwind-merge';

import Header from "../components/header"
import Footer from "../components/footer"

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
            <body className={inter.className}>
                <PrimeReactProvider >
                    <Header />

                    {children}

                    <Footer />
                </PrimeReactProvider>
            </body>
        </html>
    );
}
