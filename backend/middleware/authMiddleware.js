import jwt from 'jsonwebtoken';

// Check whether the user has a valid JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.',
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store user information in request
    req.user = decoded;

    // Allow access to the next function
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export default authMiddleware;