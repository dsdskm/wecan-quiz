// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken'; // Example: if using JWT

/**
 * Express middleware to authenticate requests using a Bearer token.
 * Checks for an Authorization header and the presence of a token.
 * Includes a TODO for actual token verification.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  // If no token is provided, return 401 Unauthorized
  if (token == null) {
    console.warn("Authentication failed: No token provided.");
    return res.sendStatus(401); // Unauthorized
  }

  // TODO: Implement actual token verification logic here.
  // - Use a library like jsonwebtoken to verify the token's signature and expiration.
  // - If verification fails, return res.sendStatus(403); // Forbidden
  // - If verification succeeds, extract user information from the token payload
  //   and attach it to the request object (e.g., req.user = user;).

  // Temporarily proceed to the next middleware/route if a token is present
  // (Replace this with actual verification)
  console.log("Temporary authentication: Token received, proceeding (verification skipped).");
  // After successful verification:
  // req.user = verifiedUser; // Assuming you have a User type
  next(); // Proceed to the next middleware/route handler
};

// Optionally export other authentication-related middleware or functions here