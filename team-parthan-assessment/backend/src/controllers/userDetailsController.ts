import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { z } from "zod";

export const details = async (req: any, res: any) => {
  const data = req.user;
  return res.json(data);
};
