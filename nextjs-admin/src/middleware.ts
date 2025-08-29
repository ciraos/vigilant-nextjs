import {
    NextRequest,
    NextResponse
} from "next/server"

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    if (req.nextUrl.pathname !== '/login' && !token) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - .next/static (static files)
         * - .next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|.next/static|.next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
