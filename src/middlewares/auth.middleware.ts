import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { verify } from "jsonwebtoken";

class AuthMiddleware {
  public isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const { authorization } = req.headers;
    if (!authorization) throw new AppError("Missing bearer token", 401);

    const [_bearer, token] = authorization.split(" ");
    const secret = process.env.JWT_SECRET!;

    try {
      const decodedToken = verify(token, secret) as { sub: string; };
      res.locals.userId = decodedToken.sub;

      next();
    } catch (error) {
      throw new AppError("Invalid token", 401);
    }
  };
}

export const auth = new AuthMiddleware();
