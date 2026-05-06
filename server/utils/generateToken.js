import jwt from 'jsonwebtoken';

/**
 * - COOKIE_SECURE=true|false forces behavior (false = plain HTTP only, trusted networks).
 * - Otherwise: never Secure in development; in production, Secure only when req.secure
 *   (use app.set('trust proxy', 1) so HTTPS behind Ingress/proxy sets req.secure).
 */
export function resolveCookieSecure(req) {
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (process.env.COOKIE_SECURE === 'false') return false;
  if (process.env.NODE_ENV === 'development') return false;
  return Boolean(req?.secure);
}

const generateTokenAndSetCookie = (userId, res, req) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: '15d',
  });
  const secure = resolveCookieSecure(req);
  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure,
  });
};

export const clearAuthCookie = (res, req) => {
  res.cookie('jwt', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: 'strict',
    secure: resolveCookieSecure(req),
  });
};

export default generateTokenAndSetCookie;
