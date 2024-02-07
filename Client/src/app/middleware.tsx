import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const localStorageUser = JSON.parse(localStorage.getItem("user") || "");
    const currentVerificationCode = localStorageUser?.verificationCode

    if (currentVerificationCode) {
        return NextResponse.redirect(new URL('/chat', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
    matcher: ['/chat'],
}