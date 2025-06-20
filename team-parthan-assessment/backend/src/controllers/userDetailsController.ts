import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { z } from "zod";

export const details = async (req: any, res: any) => {
  const data = req.user;
  return res.json(data);
};

export const uploadPhoto = async (req: any, res: any) => {
  try {
    const id = req.userId;
    const { photo } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Missing userId" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { avatar: photo as string },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(201)
      .json({ message: "Updated profile picture successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateDetails = async (req: any, res: any) => {
  try {
    const id = req.userId;
    const { item, value } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Missing userId" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { [item]: value },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(201).json({ message: `Updated ${item} successfully.` });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
