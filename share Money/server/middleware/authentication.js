const { validateToken } = require("../service/authentication1");

const DEFAULT_COOKIE_NAME = 'auth_token';

function checkForAuthenticationCookie(cookieName = DEFAULT_COOKIE_NAME, options = { strict: false }) {
  return (req, res, next) => {
    const token = req.cookies[cookieName];

    if (!token) {
      if (options.strict) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }
      return next(); // No token, proceed without user authentication
    }

    try {
      // Validate the token and attach user payload to the request object
      const userPayload = validateToken(token);
      req.user = userPayload; // Attach the user info to the request
    } catch (error) {
      // Log the error with request details
      console.error(`Token validation failed for request to ${req.path} from ${req.ip}:`, error);

      // Handle expired tokens
      if (error.name === 'TokenExpiredError') {
        console.warn('Authentication token has expired');
      }

      // Optional: Send a 401 Unauthorized response if in strict mode
      if (options.strict) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
    }

    return next(); // Continue to the next middleware/route handler
  };
}

module.exports = { checkForAuthenticationCookie };
