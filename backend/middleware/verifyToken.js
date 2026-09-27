// backend/middleware/verifyToken.js
// This literaly means who are you? This is a middleware that checks if the user is authenticated by verifying the JWT token sent in the request headers. If the token is valid, it decodes the token and attaches the user information to the request object, allowing subsequent middleware or route handlers to access the user's details. If the token is invalid or expired, it responds with a 401 Unauthorized error.

// verifyToken puts the user's identity/role into req.user
const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

