import type { Metadata } from "next";
import dynamic from 'next/dynamic';

import { ProLayout } from '@ant-design/pro-components';

import { Providers } from "../Provider/Providers";
import "../styles/tailwind.css";
const DynamicMessageProvider = dynamic(() => import('../Provider/MessageProvider'), {
    ssr: false,
});

export const metadata: Metadata = {
    title: "CCG CollisionCareGuide",
    description: "法律法遵機器人",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <html lang="en">
            <body className="min-h-screen" >
                <Providers >
                    <DynamicMessageProvider>
                        {children}
                    </DynamicMessageProvider>
                </Providers>
            </body>
        </html>
    );
}
