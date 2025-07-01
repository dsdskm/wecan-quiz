// src/middleware/auth.ts

import { Request, Response, NextFunction, } from 'express';
// import jwt from 'jsonwebtoken'; // Example: if using JWT

/**
 * Express middleware to authenticate requests using a Bearer token.
 * Checks for an Authorization header and the presence of a token.
 * Includes a TODO for actual token verification.
 */
import jwt from 'jsonwebtoken';
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  // If no token is provided, return 401 Unauthorized
  if (token == null) {
    console.warn("Authentication failed: No token provided.");
    return res.sendStatus(401); // Unauthorized
  }

  const jwtSecret = process.env.JWT_SECRET; // Ensure this environment variable is set

  if (!jwtSecret) {
    console.error("JWT Secret not configured.");
    return res.sendStatus(500); // Internal Server Error if secret is missing
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.warn("Token verification failed:", err.message);
      return res.sendStatus(403); // Forbidden
    }
    (req as any).user = user; // Attach the decoded user payload to the request object
    next(); // Proceed to the next middleware/route handler
  });
};

// Optionally export other authentication-related middleware or functions here