import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const auth =
  (...requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;

      // ১. টোকেন আছে কিনা এবং সেটি Bearer দিয়ে শুরু হয়েছে কিনা চেক করা
      if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access. Token is missing or malformed",
        });
      }

      // ২. 'Bearer ' অংশটুকু বাদ দিয়ে শুধুমাত্র মূল টোকেনটা আলাদা করা
      const token = bearerToken.split(" ")[1];

      // ৩. এখন শুধু আসল টোকেনটি ভেরিফাই করা
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as any;

      req.user = decoded;

      if (
        requiredRoles.length &&
        !requiredRoles.includes(decoded.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You do not have permission to access this resource.",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  };

export default auth;