import { Request, Response } from 'express';
import {hash, compare} from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

import { UserModel } from '../models/User';

export async function register(req: Request, res: Response): Promise<void> {
    try{
        const { username, email, password } = req.body;
        const passwordHash = await hash(password, 10);
        const newUser = new UserModel({ username, email, passwordHash });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isPasswordValid = await compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ id: user._id }, ENV.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export async function logout(req: Request, res: Response): Promise<void> {
    try {
        // Invalidate the token (if using a token-based authentication system)
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Generate a password reset token and send it to the user's email
        // const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        // Send email with the token (using a service like Nodemailer)
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
export async function resetPassword(req: Request, res: Response): Promise<void> {
    try {
        const { token, newPassword } = req.body;
        // Verify the token and get the user ID
        // const decoded = jwt.verify(token, 'your_jwt_secret');
        // const userId = decoded.id;
        const user = await UserModel.findById('userId'); // Replace with actual user ID
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const passwordHash = await hash(newPassword, 10);
        user.passwordHash = passwordHash;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}