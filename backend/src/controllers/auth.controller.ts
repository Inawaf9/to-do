import asyncHandler from 'express-async-handler';

import { registerUser, loginUser, forgotPasswordService, resetPasswordService, refreshTokenService } from '../services/auth.service';

export const register = asyncHandler(async (req: any, res: any) => {
    const { username, email, password } = req.body;

    await registerUser(username, email, password);

    res.status(201).json({ message: "User registered successfully"});

});

export const login = asyncHandler(async (req: any, res: any) => {
    const { email, password } = req.body;
    const {accessToken , refreshToken} = await loginUser(email, password);
    res.status(200).json({ AccessToken: accessToken, RefreshToken: refreshToken });

});

export const forgotPassword = asyncHandler(async (req: any, res: any) => {
    const { email } = req.body;
    const resetToken = await forgotPasswordService(email);
    res.status(200).json({ resetToken });
});

export const resetPassword = asyncHandler(async (req: any, res: any) => {
    const {  newPassword, newConfirmPassword } = req.body;
    const { resetToken } = req.params;
    
    await resetPasswordService(resetToken, newPassword, newConfirmPassword);
    
    res.status(200).json({ message: "Password reset successfully" });
});

export const refresh = asyncHandler(async (req: any, res: any) => {
    const { refreshToken } = req.body;
    const accessToken = await refreshTokenService(refreshToken);

    res.status(200).json({ accessToken });
});

export const logout = asyncHandler(async (req: any, res: any) => {
    res.status(200).json({ message: "Logged out successfully" });
});