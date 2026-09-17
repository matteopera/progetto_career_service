import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth.js";
import { Request, Response, NextFunction } from "express";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "Non autorizzato" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Errore durante la verifica della sessione" });
  }
}
