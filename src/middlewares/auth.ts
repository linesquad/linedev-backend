import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Auth from "../models/Auth";
import { JWTPayload } from "../types/express";

export const requireRole = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JWTPayload;
      const user = await Auth.findById(decoded.id);
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      if (!roles.includes(user.role)) {
        res
          .status(403)
          .json({
            message: `Forbidden: ${user.role} is not allowed to access this resource`,
          });
        return;
      }
      
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
  };
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JWTPayload;
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
