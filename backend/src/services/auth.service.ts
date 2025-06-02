import { send } from "process";
import { UserModel } from "../models/User.model";
import { sendEmail } from "./email.service";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

export async function registerUser(username: string, email: string, password: string) {
    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new Error("User already exists with this username or email");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
        username,
        email,
        password: hashedPassword,
    });
    await user.save();
    await sendEmail(`Todo <todo@nawafalghamdi.com>`, email, "Registration Successful", `Welcome ${username}, you have successfully registered.`);
}

export async function loginUser(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid email or password");
    }
    const accessToken = Jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
    const refreshToken = Jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });


        // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // const userAgent = req.headers['user-agent'] || '';
        // const parser = new UAParser(userAgent);
        // const ua = parser.getResult();
        // const session = {
        //     userId: user._id,
        //     refreshToken: refreshToken,
        //     ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().replace(/^::ffff:/, ''),
        //     deviceType: ua.device.type || 'desktop',
        //     os: ua.os.name || 'unknown',
        //     browser: ua.browser.name || 'unknown',
        //     userAgent,
        //     createdAt: new Date(),
        // };

    // await sendEmail(`Todo <todo@nawafalghamdi.com>`, email, "Login Successful", `Welcome ${user.username}, you have successfully logged in.`);

    return { accessToken, refreshToken };
}

export async function forgotPasswordService(email: string){
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const resetToken = Jwt.sign({ id: user._id }, process.env.RESET_TOKEN_SECRET!, { expiresIn: '15m' });
    await sendEmail(`Todo <todo@nawafalghamdi.com>`, email, "Reset Password", `Click <a href="http://localhost:3000/reset-password/${resetToken}">here</a> to reset your password.`);
    return resetToken;
}

export async function resetPasswordService(resetToken: string, newPassword: string, newConfirmPassword: string) {
    Jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET!, async (err: any, user: any) => {
        if (err) {
            throw new Error("Invalid or expired reset token");
        }
        if (newPassword !== newConfirmPassword) {
            throw new Error("Passwords do not match");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.findByIdAndUpdate(user.id, { password: hashedPassword });
    });
}

export async function refreshTokenService(refreshToken: string) {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }
    Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, user: any) => {
        if (err) {
            throw new Error("Invalid refresh token");
        }
        const accessToken = Jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
        return accessToken;
    });
}
