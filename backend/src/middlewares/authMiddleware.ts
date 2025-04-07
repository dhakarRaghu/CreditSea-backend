import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticateToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  console.log("token in auth middleware", token);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(
        token, 
        process.env.JWT_SECRET as string, 
        (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
          if (err) reject(err);
          else resolve(decoded);
        }
      );
    });
    console.log("decoded in auth middleware", decoded);
    req.user = decoded as { id: string; role: string };
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' , error: err });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};