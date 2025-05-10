import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const IsAuthenticated = (req:any, res:any, next:any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, ENV.ACCESS_TOKEN_SECRET, (err:any, id:any) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.id = id;
    next();
  });
};

