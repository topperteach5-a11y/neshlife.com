import crypto from 'crypto';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-me';

interface JWTPayload {
  email: string;
  iat: number;
  exp: number;
}

/**
 * Base64url encode a buffer
 */
function base64urlEncode(data: Buffer): string {
  return data.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Base64url decode a string
 */
function base64urlDecode(str: string): Buffer {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}

/**
 * Create a signed JWT token
 */
export function signToken(payload: { email: string }, expiresInHours: number = 24 * 7): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInHours * 3600,
  };

  const encodedHeader = base64urlEncode(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64urlEncode(Buffer.from(JSON.stringify(fullPayload)));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();
  const encodedSignature = base64urlEncode(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    // Verify signature
    const expectedSignature = base64urlEncode(
      crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest()
    );

    if (encodedSignature !== expectedSignature) return null;

    // Decode payload
    const payload: JWTPayload = JSON.parse(base64urlDecode(encodedPayload).toString());

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Verify admin session from request cookies.
 * Returns the decoded payload if valid, null otherwise.
 */
export function verifyAdminSession(request: Request): JWTPayload | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...rest] = c.trim().split('=');
      return [key, rest.join('=')];
    })
  );

  const token = cookies['admin_token'];
  if (!token) return null;

  return verifyToken(token);
}
