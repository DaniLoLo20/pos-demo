import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.rol)) {
      return res.status(403).json({
        message: "Acceso denegado ❌",
      });
    }

    next();
  };
};