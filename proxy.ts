import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy (formerly Middleware) for Basic Authentication.
 * This runs on the server before a request is completed.
 */
export function proxy(request: NextRequest) {
  // Skip authentication in development mode
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const basicAuthUser = process.env.BASIC_AUTH_USER;
  const basicAuthPass = process.env.BASIC_AUTH_PASSWORD;

  // Skip authentication if environment variables are not set
  if (!basicAuthUser || !basicAuthPass) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    try {
      // Basic auth header is "Basic <base64(user:pass)>"
      const authValue = authHeader.split(' ')[1];
      const decoded = atob(authValue);
      const [user, pass] = decoded.split(':');

      if (user === basicAuthUser && pass === basicAuthPass) {
        return NextResponse.next();
      }
    } catch (e) {
      // If decoding fails, treat as unauthorized
      console.error('Basic Auth decoding failed:', e);
    }
  }

  // Return 401 Unauthorized with the WWW-Authenticate header to trigger browser login dialog
  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  /**
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (metadata file)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
