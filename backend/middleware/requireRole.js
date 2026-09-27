// backend/middleware/requireRole.js
// This middleware checks if the authenticated user has the required role to access a specific route. It assumes that the user's role is included in the JWT token payload and is attached to the request object by the verifyToken middleware. If the user does not have the required role, it responds with a 403 Forbidden error.

// requireRole compares req.user.role against the roles allowed for that route.
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission to perform this action'
      });
    }

    next();
  };
}

module.exports = requireRole;