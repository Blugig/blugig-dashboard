import { verifySession } from './lib/auth'

export async function middleware(request) {
    return await verifySession(request);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}