import { Request, Response } from "express";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
  token?: string;
}

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already in use" });
    }

    const user = new User({ username, password });
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await (User as any).findByCredentials(username, password);
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.token) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    req.user.tokens = req.user.tokens.filter(
      (token: any) => token.token !== req.token
    );
    await req.user.save();
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  res.json(req.user);
};
