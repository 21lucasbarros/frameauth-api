import { Request, Response } from "express";
import { User } from "../models/User.js";

export async function register(req: Request, res: Response): Promise<Response> {
  return res.status(501).json({ message: "Not implemented" });
}
