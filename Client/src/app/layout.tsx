import type { Metadata } from "next";

import { Layout,} from 'antd';

import { Providers } from "./(components)/Providers";
import "../styles/tailwind.css";


export const metadata: Metadata = {
    title: "CCG CollisionCareGuide",
    description: "法律法遵機器人",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <html lang="en">
            <body className="min-h-screen">
                <Providers >

                    {/* <Layout> */}
                        {children}
                    {/* </Layout> */}

                </Providers>
            </body>
        </html>
    );
}
