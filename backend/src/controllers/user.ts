import { Request, Response } from "express";
import { Jwt } from "jsonwebtoken";

import { UserModel } from "../models/User";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export async function getUserById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await UserModel.findByIdAndUpdate(id, { username, email, password }, { new: true });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
