import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { proxy } from './proxy';

describe('proxy (Basic Auth)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('should skip authentication in development mode regardless of env vars', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('BASIC_AUTH_USER', 'admin');
    vi.stubEnv('BASIC_AUTH_PASSWORD', 'password123');

    const req = new NextRequest('http://localhost:3000/');
    const res = proxy(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('should skip authentication if environment variables are not set', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BASIC_AUTH_USER', '');
    vi.stubEnv('BASIC_AUTH_PASSWORD', '');

    const req = new NextRequest('http://localhost:3000/');
    const res = proxy(req);

    // NextResponse.next() returns a response with a special internal header or null body depending on version
    // In many Next.js versions, it's identified by x-middleware-next header
    expect(res.status).toBe(200);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('should return 401 if environment variables are set but no authorization header is provided', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BASIC_AUTH_USER', 'admin');
    vi.stubEnv('BASIC_AUTH_PASSWORD', 'password123');

    const req = new NextRequest('http://localhost:3000/');
    const res = proxy(req);

    expect(res.status).toBe(401);
    expect(res.headers.get('WWW-Authenticate')).toBe('Basic realm="Secure Area"');
  });

  it('should return 401 if authorization header is invalid', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BASIC_AUTH_USER', 'admin');
    vi.stubEnv('BASIC_AUTH_PASSWORD', 'password123');

    const req = new NextRequest('http://localhost:3000/', {
      headers: {
        authorization: 'Basic ' + btoa('wrong:wrong'),
      },
    });
    const res = proxy(req);

    expect(res.status).toBe(401);
  });

  it('should allow access if valid credentials are provided', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BASIC_AUTH_USER', 'admin');
    vi.stubEnv('BASIC_AUTH_PASSWORD', 'password123');

    const req = new NextRequest('http://localhost:3000/', {
      headers: {
        authorization: 'Basic ' + btoa('admin:password123'),
      },
    });
    const res = proxy(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('should return 401 if decoding fails', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BASIC_AUTH_USER', 'admin');
    vi.stubEnv('BASIC_AUTH_PASSWORD', 'password123');

    const req = new NextRequest('http://localhost:3000/', {
      headers: {
        authorization: 'Basic invalid-base64-content',
      },
    });
    const res = proxy(req);

    expect(res.status).toBe(401);
  });
});
