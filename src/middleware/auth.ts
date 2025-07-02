// src/middleware/auth.ts

import Logger from '@/utils/Logger';
import { Request, Response, NextFunction, } from 'express';
import jwt from 'jsonwebtoken';
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    Logger.warn("Authentication failed: No token provided.");
    return res.sendStatus(401);
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    Logger.error("JWT Secret not configured.");
    return res.sendStatus(500);
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      Logger.warn("Token verification failed:", err.message);
      return res.sendStatus(403); // Forbidden
    }
    (req as any).user = user;
    next();
  });
};
