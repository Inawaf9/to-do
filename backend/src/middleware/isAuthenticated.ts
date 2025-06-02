import Jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';

export const authMiddleware = asyncHandler(async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization token is required" });
    }
    const token = authHeader.split(' ')[1];

    const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.user = decoded;
    next();
});