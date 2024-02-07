import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 從請求中獲取cookie
    const token = request.cookies.get('verificationCode');

    // 檢查是否存在token，這裡的token代表用戶的登入狀態
    if (!token) {
        // 如果沒有token且請求的是除/login之外的頁面，則重定向到/login
        // 防止登入頁面重定向到自身
        if (!request.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    } else {
        // 如果有token但是訪問的是/login，則重定向到/chat或其他頁面
        if (request.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/chat', request.url));
        }
    }

    // 如果不需要重定向，則正常處理請求
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/chat', '/register'], // 或其他你需要保護的路由
};
