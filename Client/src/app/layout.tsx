import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./(components)/Providers";
import "../styles/tailwind.css";

import { Header } from "./(components)/Header";

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
                <Providers >
                    <Header></Header>

                    {children}

                </Providers>
            </body>
        </html>
    );
}
