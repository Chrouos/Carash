"use client";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <NextUIProvider className="min-h-screen">{children}</NextUIProvider>;
}